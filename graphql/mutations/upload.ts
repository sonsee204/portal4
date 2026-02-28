import { gql } from 'graphql-tag';

export const UPLOAD_TOURNAMENT_IMAGE = gql`
  mutation UploadTournamentImage($input: UploadTournamentImageInput!) {
    uploadTournamentImage(input: $input) {
      url
      key
    }
  }
`;
