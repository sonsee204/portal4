import { gql } from 'graphql-tag';

export const USER_CORE_FRAGMENT = gql`
  fragment UserCore on User {
    _id
    userName
    fullName
    displayName
    photoURL
  }
`;
