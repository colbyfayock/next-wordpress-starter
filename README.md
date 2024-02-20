# Next.js WordPress Starter

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-19-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Scaling WordPress with the power of [Next.js](https://nextjs.org/) and the static web!

- [⚡️ Quick Start](#%EF%B8%8F-quick-start)
- [🚀 Getting Started](#-getting-started)
- [🛠 Configuring Your Project](#-configuring-your-project)
- [🔌 Plugins](#-plugins)
- [💝 Sponsors](#-sponsors)
- [✨ Contributors](#-contributors)

## ⚡️ Quick Start

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/colbyfayock/next-wordpress-starter) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcolbyfayock%2Fnext-wordpress-starter)

### Requirements
* [WordPress](https://wordpress.org/)
* [WPGraphQL](https://www.wpgraphql.com/)
* Environment variables (see below)

```bash
yarn create next-app -e https://github.com/colbyfayock/next-wordpress-starter
# or
npx create-next-app -e https://github.com/colbyfayock/next-wordpress-starter
```

Add an `.env.local` file to the root with the following:
```
WORDPRESS_GRAPHQL_ENDPOINT="http://wordpressite.com/graphql"
```

In some cases, the above may not work.
Change it as follows:
```
WORDPRESS_GRAPHQL_ENDPOINT="http://yourhost.com/index.php?graphql
```

## 🚀 Getting Started

### What is this and what does it include?

The goal of this project is to take WordPress as a headless CMS and use Next.js to create a static experience without any 3rd party services that can be deployed anywhere.

The hope is to build out as many features as we can to support what's typically expected from an out of the box theme on WordPress. Currently, those features include:
* Blog (https://next-wordpress-starter.spacejelly.dev)
* Pages (https://next-wordpress-starter.spacejelly.dev/about/)
* Posts (https://next-wordpress-starter.spacejelly.dev/posts/how-to-create-a-headless-wordpress-blog-with-next-js-wordpress-starter/)
* Categories (https://next-wordpress-starter.spacejelly.dev/categories/tutorial/)
* Authors (https://next-wordpress-starter.spacejelly.dev/authors/colby-fayock/)
* Search (Client side global navigation and https://next-wordpress-starter.spacejelly.dev/search/?q=wordpress)
* RSS (https://next-wordpress-starter.spacejelly.dev/feed.xml)
* Sitemap (https://next-wordpress-starter.spacejelly.dev/sitemap.xml)

Additionally, the theme is expected to be SEO friendly and performant out of the box, including:
* Unique page titles
* Unique descriptions
* Open Graph tags

You can also optionally enable Yoast SEO plugin support to supercharge your SEO! (See below)

Check out the [Issues](https://github.com/colbyfayock/next-wordpress-starter/issues) for what's on deck!

*Want something a little more **basic**? Check out my other starter with an MVP setup to get up and running with WPGraphQL in WordPress: https://github.com/colbyfayock/next-wpgraphql-basic-starter*

### Requirements
* [WordPress](https://wordpress.org/)
* [WPGraphQL](https://www.wpgraphql.com/)
* Environment variables (see below)

### Environment

This project makes use of WPGraphQL to query WordPress with GraphQL. In order to make that request to the appropriate endpoint, we need to set a environment variable to let Next.js know where to request the site information from.

Create a new file locally called `.env.local` and add the following:

```bash
WORDPRESS_GRAPHQL_ENDPOINT="[WPGraphQL Endpoint]"
```

Replace the contents of the variable with your WPGraphQL endpoint. By default, it should resemble `[Your Host]/graphql`.

*Note: environment variables can optionally be statically configured in next.config.js*

#### All Environment Variables

| Name                               | Required | Default | Description                                       |
| ---------------------------------- | -------- | -       | ------------------------------------------------- |
| WORDPRESS_GRAPHQL_ENDPOINT         | Yes      | -       | WordPress WPGraphQL endpoint (ex: host.com/graphl)|
| WORDPRESS_MENU_LOCATION_NAVIGATION | No       | PRIMARY | Configures header navigation Menu Location        |
| WORDPRESS_PLUGIN_SEO               | No       | false   | Enables SEO plugin support (true, false)          |

Please note some themes do not have PRIMARY menu location.

### Development

To start the project locally, run:

```bash
yarn dev
# or
npm run dev
```

The project should now be available at [http://localhost:3000](http://localhost:3000)!

#### ESLint extension for Visual Studio Code

It is possible to take advantage of this extension to improve the development experience.
To set up the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) in Visual Studio Code add a new folder to the root `.vscode`. Inside add a file `settings.json` with the following content:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

With this file ESLint will automatically fix and validate syntax errors and format the code on save (based on Prettier configuration).

### Deployment

#### Netlify

There are two options as to how you can deploy this project to Netlify:
* [Essential Next.js Plugin](https://github.com/netlify/netlify-plugin-nextjs) (recommended)
* [Exporting the project](https://nextjs.org/docs/advanced-features/static-html-export) via `next export`

**Essential Next.js Plugin** should be provided as an option when you're first importing a project based on this starter. If it's not, you can install this plugin using the Netlify Plugins directory. This will allow the project to take full advantage of all native Next.js features that Netlify supports with this plugin.

**Exporting the project** lets Next.js compile the project into static assets including HTML files. This allows you to deploy the project as a static site directly to Netlify just like any other site. You can do this by adding `next export` to the end of the `build` command inside `package.json` (ex: `next build && next export`).

Regardless of which option you choose, you can configure your [environment variables](#environment) either when creating your new site or by navigating to Site Settings > Build & Deploy > Environment and triggering a new deploy once added.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/colbyfayock/next-wordpress-starter)

#### Vercel

Given Next.js is a Vercel-supported project, you can simply import the project as a new site and configure your [environment variables](#environment) by either adding them during import or by navigating to Settings > Environment Variables and triggering a new build once added.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcolbyfayock%2Fnext-wordpress-starter)

## 🛠 Configuring Your Project

### package.json

In order to avoid an additional configuration file, we take advantage of some built-in properties of `package.json` to configure parts of the website.

| Name                       | Required | Description                                                        |
| -------------------------- | -------- | ------------------------------------------------------------------ |
| homepage                   | Yes      | Homepage or hostname used to construct full URLs (ex Open Graph)   |

- homepage: Setting the `homepage` property will update instances where the full URL is required such as Open Graph tags

### WordPress

This project aims to take advantage of as many built-in WordPress features by default like a typical WordPress theme. Those include:

| Name                       | Usage                                   |
| -------------------------- | --------------------------------------- |
| Site Language              | `lang` attribute on the `<html>` tag    |
| Site Title                 | Homepage header, page metadata          |
| Tagline                    | Homepage subtitle                       |

There is some specific WordPress configuration required to allow for the best use of this starter.

### Images

This Starter doesn't currently provide any mechanisms for dealing with image content from WordPress. The images are linked to "as is", meaning if the image is uploaded via the WordPress interface, the image will be served from WordPress.

To serve the images statically, you have a few options.

#### Jetpack

By enabling the Image Accelerator from Jetpack, your images will automatically be served statically and cached via the wp.com CDN. This feature comes free with the basic installation of Jetpack, requiring only that you connect the WordPress site to the Jetpack service.

[Jetpack CDN](https://jetpack.com/features/design/content-delivery-network/)

## 🔌 Plugins

### Yoast SEO

The Yoast SEO plugin is partially supported including most major features like metadata and open graph customization.

#### Requirements
* Yoast SEO plugin
* Add WPGraphQL SEO plugin

To enable the plugin, configure `WORDPRESS_PLUGIN_SEO` to be `true` either as an environment variable or within next.config.js.

## 🥾 Bootstrapped with Next.js WordPress Starter

Examples of websites that started off with Next.js WordPress Starter

* [colbyfayock.com](https://colbyfayock.com/)
* [spacejelly.dev](https://spacejelly.dev/)

## 💝 Sponsors

WordPress hosting for the public-facing project provided by [WP Engine](https://wpengine.com/).

<img width="315" height="60" src="https://user-images.githubusercontent.com/1045274/119288571-cb3ce480-bc16-11eb-9061-9cc264ca16de.jpg" alt="WP Engine Logo" />

## ✨ Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://colbyfayock.com/newsletter"><img src="https://avatars2.githubusercontent.com/u/1045274?v=4?s=100" width="100px;" alt="Colby Fayock"/><br /><sub><b>Colby Fayock</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=colbyfayock" title="Code">💻</a> <a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=colbyfayock" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.kevincunningham.co.uk"><img src="https://avatars3.githubusercontent.com/u/8320213?v=4?s=100" width="100px;" alt="Kevin Cunningham"/><br /><sub><b>Kevin Cunningham</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=doingandlearning" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://guilleangulo.me"><img src="https://avatars0.githubusercontent.com/u/50624358?v=4?s=100" width="100px;" alt="Guillermo Angulo"/><br /><sub><b>Guillermo Angulo</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=GuilleAngulo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.heinsnyman.co.za"><img src="https://avatars0.githubusercontent.com/u/22816814?v=4?s=100" width="100px;" alt="Hein Snyman"/><br /><sub><b>Hein Snyman</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=HeinSnyman" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/grische"><img src="https://avatars0.githubusercontent.com/u/2787581?v=4?s=100" width="100px;" alt="Grische"/><br /><sub><b>Grische</b></sub></a><br /><a href="#tool-grische" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jatin-rathee"><img src="https://avatars0.githubusercontent.com/u/44899844?v=4?s=100" width="100px;" alt="Jatin Rathee"/><br /><sub><b>Jatin Rathee</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=jatin-rathee" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://highaltitude.io/"><img src="https://avatars.githubusercontent.com/u/2972436?v=4?s=100" width="100px;" alt="Dave"/><br /><sub><b>Dave</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=thedavedavies" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://bradgarropy.com"><img src="https://avatars.githubusercontent.com/u/11336745?v=4?s=100" width="100px;" alt="Brad Garropy"/><br /><sub><b>Brad Garropy</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=bradgarropy" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://ffabiosales.github.io"><img src="https://avatars.githubusercontent.com/u/1392528?v=4?s=100" width="100px;" alt="Fábio Sales"/><br /><sub><b>Fábio Sales</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=ffabiosales" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://leoloso.com"><img src="https://avatars.githubusercontent.com/u/1981996?v=4?s=100" width="100px;" alt="Leonardo Losoviz"/><br /><sub><b>Leonardo Losoviz</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=leoloso" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.avneesh.tech/"><img src="https://avatars.githubusercontent.com/u/76690419?v=4?s=100" width="100px;" alt="Avneesh Agarwal"/><br /><sub><b>Avneesh Agarwal</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=avneesh0612" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/PhattOZ"><img src="https://avatars.githubusercontent.com/u/63938605?v=4?s=100" width="100px;" alt="Phattarapol L."/><br /><sub><b>Phattarapol L.</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=PhattOZ" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://capecod.world"><img src="https://avatars.githubusercontent.com/u/26460352?v=4?s=100" width="100px;" alt="Peter Cruckshank"/><br /><sub><b>Peter Cruckshank</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=petercr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ogrady.ie"><img src="https://avatars.githubusercontent.com/u/130415?v=4?s=100" width="100px;" alt="Shane O'Grady"/><br /><sub><b>Shane O'Grady</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=shaneog" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://roundhouse-designs.com"><img src="https://avatars.githubusercontent.com/u/665784?v=4?s=100" width="100px;" alt="Nick Gaswirth"/><br /><sub><b>Nick Gaswirth</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=gaswirth" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/alexandruvisan19"><img src="https://avatars.githubusercontent.com/u/79447321?v=4?s=100" width="100px;" alt="alexandruvisan19"/><br /><sub><b>alexandruvisan19</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=alexandruvisan19" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://linktr.ee/theritikchoure"><img src="https://avatars.githubusercontent.com/u/56495602?v=4?s=100" width="100px;" alt="Ritik Chourasiya"/><br /><sub><b>Ritik Chourasiya</b></sub></a><br /><a href="#tool-theritikchoure" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://rickknowlton.io"><img src="https://avatars.githubusercontent.com/u/10679138?v=4?s=100" width="100px;" alt="Rick Knowlton"/><br /><sub><b>Rick Knowlton</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=rickknowlton" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/amjedidiah"><img src="https://avatars.githubusercontent.com/u/17021436?v=4?s=100" width="100px;" alt="Jedidiah Amaraegbu"/><br /><sub><b>Jedidiah Amaraegbu</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=amjedidiah" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
