import { gql } from '@apollo/client';

export const QUERY_SITE_DATA = gql`
  {
    generalSettings {
      description
      language
      title
    }
  }
`;
