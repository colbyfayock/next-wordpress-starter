export const QUERY_SITE_DATA = `
  query SiteData {
    generalSettings {
      description
      language
      title
      __typename
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
        __typename
      }
      social {
        youTube {
          url
          __typename
        }
        wikipedia {
          url
          __typename
        }
        twitter {
          username
          cardType
          __typename
        }
        pinterest {
          metaTag
          url
          __typename
        }
        mySpace {
          url
          __typename
        }
        linkedIn {
          url
          __typename
        }
        instagram {
          url
          __typename
        }
        facebook {
          url
          defaultImage {
            altText
            sourceUrl
            mediaDetails {
              height
              width
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
