# WIP - Next.js WordPress Starter
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## ⚡️ Quick Start

```bash
yarn create next-app -e https://github.com/colbyfayock/next-wordpress-starter
# or
npx create-next-app -e https://github.com/colbyfayock/next-wordpress-starter
```

Add an `.env.local` file to the root with the following:

## 🚀 Getting Started

### Environment

This project makes use of the WordPress REST API. In order to make that request to the appropriate endpoint, we need to set a environment variable to let Next.js know where to request the site information from.

Create a new file locally called `.env.local` and add the following:

```bash
WORDPRESS_HOST="[host]"
```

Replace `[host]` with your the home URL of your WordPress instance.

### Development

To start the project locally, run:

```bash
npm run dev
# or
yarn dev
```

The project should now be available at [http://localhost:3000](http://localhost:3000).

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## 🛠 Configuration

### package.json

In order to avoid an additional configuration file, we take advantage of some built-in properties of `package.json` to configure some of the website properties.

- homepage: Setting the `homepage` property will update instances where the full URL is required such as Open Graph tags

### WordPress

This project aims to take advantage of as many built-in WordPress features by default. Those include:

- Site Title: Used for the homepage header as well as the default meta title
- Tagline: Used on the homepage for the header subtitle

There is some specific WordPress configuration required to allow for the best use of this starter.

* [Exposing data without markup](./docs/exposing-data.md)
### Images

By default, this Starter doesn't provide any mechanisms for dealing with image content from WordPress. The images are linked to "as is", meaning if the image is uploaded via the WordPress interface, the image will be served from WordPress.

To serve the images statically, you have a few options.

#### Jetpack

By enabling the Image Accelerator from Jetpack, your images will automatically be served statically and cached via the wp.com CDN. This feature comes free with the basic installation of Jetpack, requiring only that you connect the WordPress site to the Jetpack service.

[Jetpack CDN](https://jetpack.com/features/design/content-delivery-network/)

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://colbyfayock.com/newsletter"><img src="https://avatars2.githubusercontent.com/u/1045274?v=4" width="100px;" alt=""/><br /><sub><b>Colby Fayock</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=colbyfayock" title="Code">💻</a> <a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=colbyfayock" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.kevincunningham.co.uk"><img src="https://avatars3.githubusercontent.com/u/8320213?v=4" width="100px;" alt=""/><br /><sub><b>Kevin Cunningham</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=doingandlearning" title="Code">💻</a></td>
    <td align="center"><a href="http://guilleangulo.me"><img src="https://avatars0.githubusercontent.com/u/50624358?v=4" width="100px;" alt=""/><br /><sub><b>Guillermo Angulo</b></sub></a><br /><a href="https://github.com/colbyfayock/next-wordpress-starter/commits?author=GuilleAngulo" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
