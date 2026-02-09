import { gql } from '@/lib/request';

/**
 * getMenuItemsByLocation
 */

export async function getMenuItemsByLocation(location) {
  let data;

  try {
    data = await gql({
      query: `
        query MenuItemsByLocation($location: MenuLocationEnum) {
          menuItems(where: { location: $location }) {
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
        location,
      },
    });
  } catch (e) {
    console.log(`[menus][getMenuItemsByLocation] Failed to query menu: ${e.message}`);
    throw e;
  }

  // Handle case where menu items are not found or response is malformed
  if (!data?.data?.menuItems) {
    if (data?.errors) {
      console.warn(`[menus][getMenuItemsByLocation] GraphQL errors for location "${location}":`, data.errors);
    }
    return [];
  }

  const { nodes = [] } = data.data.menuItems;

  if (!nodes.length) {
    return [];
  }

  const topLevelItem = nodes.filter(({ parentId }) => !parentId);

  const menuItems = topLevelItem.map((item) => {
    const children = nodes.filter((node) => node.parentId === item.key);
    return {
      ...item,
      children,
    };
  });

  return menuItems;
}
