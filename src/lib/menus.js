import { gql } from '@apollo/client';

import { getApolloClient } from '@/lib/apollo-client';

/**
 * getMenuItemsByLocation
 */

export async function getMenuItemsByLocation(location) {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: gql`
      query MenuItemsByLocation($location: MenuLocationEnum) {
        menuItems(where: {location: $location}) {
          nodes {
            key: id
            parentId
            title: label
            uri
          }
        }
      }
    `,
    variables: {
      location
    }
  });

  const { nodes } = data.data.menuItems;

  const topLevelItem = nodes.filter(({ parentId }) => !parentId)

  const menuItems = topLevelItem.map(item => {
    const children = nodes.filter(node => node.parentId === item.key);
    return {
      ...item,
      children
    }
  });

  return menuItems;
}