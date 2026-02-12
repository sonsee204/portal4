/**
 * Lightweight GraphQL client for Server Components (RSC).
 * Uses fetch directly - no Apollo Client in RSC.
 */

const getGraphqlUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (url) return url;
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql'
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/graphql`;
};

export type RscGraphqlOptions = {
  revalidate?: number | false;
  cache?: RequestCache;
};

export async function rscGraphql<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options: RscGraphqlOptions = {}
): Promise<T> {
  const { revalidate = 60, cache = 'force-cache' } = options;
  const res = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Apollo-Require-Preflight': 'true',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags: ['graphql'] },
    cache,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL request failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join('; ')
    );
  }
  return json.data as T;
}
