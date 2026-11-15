const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const WebpackPlugin = require('../plugins/plugin-compiler');
const { getAllPosts } = require('../plugins/util');

function compiler(entry = { main: [] }) {
  const hooks = { run: [], watchRun: [] };
  return {
    callbacks: hooks,
    options: { entry },
    hooks: Object.fromEntries(
      Object.keys(hooks).map((name) => [name, { tapPromise: (_, callback) => hooks[name].push(callback) }])
    ),
  };
}

function directory(t) {
  const absolute = fs.mkdtempSync(path.join(process.cwd(), '.plugin-test-'));
  t.after(() => fs.rmSync(absolute, { recursive: true }));
  return `./${path.relative(process.cwd(), absolute)}`;
}

test('compiler plugins share posts, await outputs/postcreate, and run once', async (t) => {
  t.mock.method(console, 'log', () => {});
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    requests++;
    return Response.json({ data: { posts: { edges: [] } } });
  });
  const outputDirectory = directory(t);
  const first = compiler();
  let postcreated = 0;
  for (const name of ['Search', 'Feed', 'Sitemap']) {
    new WebpackPlugin({
      url: 'https://wordpress.test/graphql',
      plugin: {
        name,
        outputDirectory,
        outputName: `${name}.txt`,
        getData: getAllPosts,
        generate: async () => name,
        postcreate: async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
          postcreated++;
        },
      },
    }).apply(first);
  }
  for (const run of first.callbacks.run) await run(first);
  assert.equal(requests, 1);
  assert.equal(postcreated, 3);
  for (const name of ['Search', 'Feed', 'Sitemap']) {
    assert.equal(fs.readFileSync(path.join(outputDirectory, `${name}.txt`), 'utf8'), name);
  }
  for (const run of first.callbacks.run) await run(first);
  assert.equal(requests, 1);
  assert.equal(postcreated, 3);

  const second = compiler();
  new WebpackPlugin({
    url: 'https://wordpress.test/graphql',
    plugin: {
      name: 'Other compiler',
      outputDirectory,
      outputName: 'other.txt',
      getData: getAllPosts,
      generate: () => 'other',
    },
  }).apply(second);
  await second.callbacks.run[0](second);
  assert.equal(requests, 2);
});

test('failed data/output/postcreate rejects the awaited hook and does not mark the plugin successful', async (t) => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'error', () => {});
  const outputDirectory = directory(t);
  for (const stage of ['data', 'generate', 'postcreate']) {
    const current = compiler(async () => ({ main: [] }));
    let fail = true;
    const action = async (name) => {
      if (fail && stage === name) throw new Error(`${stage} failed`);
      return 'fresh';
    };
    new WebpackPlugin({
      url: 'https://wordpress.test/graphql',
      plugin: {
        name: stage,
        outputDirectory,
        outputName: `${stage}.txt`,
        getData: () => action('data'),
        generate: () => action('generate'),
        postcreate: () => action('postcreate'),
      },
    }).apply(current);
    await assert.rejects(current.callbacks.watchRun[0](current), new RegExp(`${stage} failed`));
    if (stage !== 'postcreate') assert.ok(!fs.existsSync(path.join(outputDirectory, `${stage}.txt`)));
    fail = false;
    await current.callbacks.watchRun[0](current);
    assert.equal(fs.readFileSync(path.join(outputDirectory, `${stage}.txt`), 'utf8'), 'fresh');
  }
});
