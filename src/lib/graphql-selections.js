const POST_FIELDS = ['id', 'categories', 'databaseId', 'date', 'isSticky', 'postId', 'slug', 'title', '__typename'];
const PAGE_FIELDS = ['children', 'id', 'menuOrder', 'parent', 'slug', 'title', 'uri', '__typename'];
const POST_RANKS = { index: 0, archive: 1, all: 2 };
const PAGE_RANKS = { index: 0, archive: 0, all: 1 };

function pickFields(node, fields) {
  if (node === null) return null;
  return Object.fromEntries(fields.filter((field) => Object.hasOwn(node, field)).map((field) => [field, node[field]]));
}

function projectConnection(result, name, fields) {
  const connection = result.data[name];
  if (connection === null) return result;
  return {
    data: {
      [name]: {
        ...connection,
        edges: connection.edges.map((edge) => ({ ...edge, node: pickFields(edge.node, fields) })),
      },
    },
  };
}

function postsSelection(family, variant) {
  if (!['all', 'author', 'category'].includes(family) || !Object.hasOwn(POST_RANKS, variant)) {
    throw new TypeError(`Unknown posts query selection: ${family}/${variant}.`);
  }
  const fields = [...POST_FIELDS];
  if (variant !== 'index') {
    fields.push('excerpt');
    if (family !== 'author') fields.push('author');
  }
  if (variant === 'all') {
    fields.push('featuredImage', 'modified');
    if (family !== 'author') fields.push('content');
  }
  return {
    family: `posts/${family}`,
    rank: POST_RANKS[variant],
    project: (result) => projectConnection(result, 'posts', fields),
  };
}

function pagesSelection(variant) {
  if (!Object.hasOwn(PAGE_RANKS, variant)) {
    throw new TypeError(`Unknown pages query selection: ${variant}.`);
  }
  const fields = variant === 'all' ? [...PAGE_FIELDS, 'content', 'featuredImage'] : PAGE_FIELDS;
  return {
    family: 'pages/all',
    rank: PAGE_RANKS[variant],
    project: (result) => projectConnection(result, 'pages', fields),
  };
}

module.exports = { postsSelection, pagesSelection };
