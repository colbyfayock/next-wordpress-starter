export const QUERY_SITE_DATA = `
  query SiteData {
    generalSettings {
      description
      language
      title
      url
    }
    readingSettings {
      pageForPosts
      pageOnFront
      postsPerPage
      showOnFront
    }
  }
`;

export const QUERY_SEO_DATA = `
  query SeoData {
    seo {
      webmaster {
        yandexVerify
        msVerify
        googleVerify
        baiduVerify
      }
      social {
        youTube {
          url
        }
        wikipedia {
          url
        }
        twitter {
          username
          cardType
        }
        pinterest {
          metaTag
          url
        }
        mySpace {
          url
        }
        linkedIn {
          url
        }
        instagram {
          url
        }
        facebook {
          url
          defaultImage {
            altText
            sourceUrl
            mediaDetails {
              height
              width
            }
          }
        }
      }
    }
  }
`;
