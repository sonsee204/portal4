/**
 * Environment variable validation and access
 */

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  return value ?? '';
}

export const env = {
  /** GraphQL API URL (backend) */
  graphqlUrl:
    getEnv('NEXT_PUBLIC_GRAPHQL_URL') ||
    (typeof window === 'undefined'
      ? process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000/graphql'
        : '/graphql'
      : '/graphql'),
  /** Public site URL (for canonical, OG, etc.) */
  siteUrl: getEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3002'),
  /** Google Analytics ID (optional) */
  gaId: getEnv('NEXT_PUBLIC_GA_ID'),
} as const;
