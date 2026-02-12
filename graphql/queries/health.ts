import { gql } from 'graphql-tag';

export const HEALTH_CHECK = gql`
  query HealthCheck {
    healthCheck {
      status
      database
      timestamp
      uptime
    }
  }
`;

export const HEALTH = gql`
  query Health {
    health
  }
`;
