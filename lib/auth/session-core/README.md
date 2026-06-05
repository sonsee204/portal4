# Session core (duplicated)

Shared JWT, cookie policy, GraphQL refresh, and refresh mutex logic vendored into this repo.

**When you change these files, update the same files in `nalee-sports-web/lib/auth/session-core/` to keep behavior in sync.**

Modules: `types`, `constants`, `jwt`, `cookie-policy`, `refresh-graphql`, `refresh-mutex`.

## Environment variables

| Service | Variable | Notes |
|---------|----------|-------|
| Backend | `JWT_ACCESS_EXPIRATION=15m` | Production standard |
| Backend | `JWT_REFRESH_EXPIRATION=7d` | |
| Backend | `JWT_ACCESS_SECRET` | Min 32 chars in production |
| Backend | `JWT_REFRESH_SECRET` | Min 32 chars in production |
| Web / Portal | `JWT_ACCESS_SECRET` | Must match backend `JWT_ACCESS_SECRET` |
| Web / Portal | `JWT_SECRET` | Legacy fallback only |
| Web / Portal | `NEXT_PUBLIC_GRAPHQL_URL` | e.g. `https://api.hitri.vn/graphql` |
| Web / Portal | `NEXT_PUBLIC_GRAPHQL_WS_URL` | e.g. `wss://api.hitri.vn/graphql` |

## Manual QA matrix

1. Login → idle 20 min → navigate protected route → stay logged in (middleware silent refresh).
2. Login → idle 20 min → GraphQL mutation → stay logged in (Apollo refresh).
3. Two tabs, access expired, both active → single refresh, both stay logged in.
4. Login web + portal same user → independent sessions.
5. Refresh token expired (7d) → redirect login, cookies cleared.
6. Backend unavailable during refresh → no session wipe; retry later.
