import { gql } from '@apollo/client';

export const QUERY_SITE_DATA = gql`
  {
    generalSettings {
      title
      description
    }
  }
`;
