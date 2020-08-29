# WIP - Next.js WordPress Starter

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

* homepage: Setting the `homepage` property will update instances where the full URL is required such as Open Graph tags

### WordPress

This project aims to take advantage of as many built-in WordPress features by default. Those include:

* Site Title: Used for the homepage header as well as the default meta title
* Tagline: Used on the homepage for the header subtitle

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.