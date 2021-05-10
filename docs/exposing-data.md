# Exposing the WP data without the markup

// TODO: Video to support this process.

1. Add ACF plugin.
2. Add the WPGraphQL for Advanced Custom Fields plugin
3. Create a custom field set.
4. Exclude the Gutenberg blocks.
5. Update the graphQL calls.

## Add ACF plugin

This is available from the WP plugin library. Here is the projects documentation to help with getting up and running.
https://www.advancedcustomfields.com/resources/getting-started-with-acf/

## Add the WPGraphQL for Advanced Custom Fields plugin

This isn't available in the library and will need to be installed manually. The Github repo is https://github.com/wp-graphql/wp-graphql-acf.

### How to do that?

    * Go to tags -> latest release -> and zip file in the assets section at the bottom.
    * Download that file
    * Go to Plugins -> Add plugins -> Upload plugin and upload the zip file.
    * Save and activate.

## Create a custom field set and expose it to graphQL

When you have created your field set, you'll need to expose it to graphQL. There are some instructions here. It's easier to refer to all of the acf field groups with the same name - `acf` or `acfFields`. This consistency makes querying the data more straightfoward.
https://www.wpgraphql.com/acf/

## Exclude the Gutenberg blocks

To exclude all Gutenberg blocks, you'll need to add some custom code to your theme.

In the WordPress dashboard, navigate to Appearance->Theme Editor. You'll get a warning here about changing these files - don't worry, we know what we're doing!

On the right, you'll see a list of the theme files. Open your theme functions file (`functions.php`). Scroll to the bottom and add this code.

```php
add_filter( 'allowed_block_types', 'nextstarter_allowed_block_types' );

function nextstarter_allowed_block_types( $allowed_blocks ) {
	return [];
}
```

### What's going on here?

- `add_filter` takes two arguments:
  - The first is where in the WordPress lifecycle (the loop) would you like to add the filter.
  - The second is what function responds to that lifecycle event.
- The function at the bottom is namespaced to `nextstarter` but could be anything as long it matched the referenced value in the `add_filter` call. All this function does is return an empty array. In other words, we are allowing no Gutenberg blocks.

## Update the graphQL calls

They might look something like this:

```graphql
{
  posts {
    nodes {
      date
      title
      slug
      uri
      acf {
        content
        excerpt
        headerImage {
          srcSet
          title
          altText
        }
      }
    }
  }
}
```

### What's going on here?

We're still getting most of the meta fields (title, date, etc). Instead of getting content from the whole page, we are getting it for each ACF field. `content`, `excerpt` and `headerImage` are all fields in my post object. The first two are just text with some minimal markup, the third is an image. For images we are able to get more targetted information that our frontend will need to consume.
