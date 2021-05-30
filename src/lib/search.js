/**
 * getSearchData
 */

export async function getSearchData() {
  const response = await fetch('/wp-search.json');
  const json = await response.json();
  return json;
}
