import NextApp from 'next/app';

import { SiteContext, useSiteContext } from 'hooks/use-site';
import { SearchProvider } from 'hooks/use-search';

import { getTopLevelPages } from 'lib/pages';
import NextNProgress from 'nextjs-progressbar';
import { createMenuFromPages, MENU_LOCATION_NAVIGATION_DEFAULT } from 'lib/menus';

import 'styles/globals.scss';
import variables from 'styles/_variables.module.scss';

function App({ Component, pageProps = {}, metadata, recentPosts, categories, menus }) {
  const site = useSiteContext({
    metadata,
    recentPosts,
    categories,
    menus,
  });

  return (
    <SiteContext.Provider value={site}>
      <SearchProvider>
        <NextNProgress height={4} color={variables.progressbarColor} />
        <Component {...pageProps} />
      </SearchProvider>
    </SiteContext.Provider>
  );
}

App.getInitialProps = async function (appContext) {
  const appProps = await NextApp.getInitialProps(appContext);

  const menus = [];
  const defaultNavigation = createMenuFromPages({
    locations: [MENU_LOCATION_NAVIGATION_DEFAULT],
    pages: await getTopLevelPages({
      queryIncludes: 'index',
    }),
  });

  menus.push(defaultNavigation);

  return {
    ...appProps,
    metadata: {},
    recentPosts: [],
    categories: [],
    menus,
  };
};

export default App;
