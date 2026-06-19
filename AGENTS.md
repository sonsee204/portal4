# NALee Sports Portal — Agent Guide

Next.js 16 + Apollo Client + Tailwind 4. TypeScript **strict**. Package manager: **pnpm** (`pnpm@10.26.2`).

Admin dashboard (port **3001**). `lib/tournament/` sync từ web qua `pnpm schedule-dnd:sync` — **không** fork logic schedule/DnD riêng.

## Stack & lệnh chạy

| Mục                        | Lệnh                                |
| -------------------------- | ----------------------------------- |
| Dev                        | `pnpm dev` (port 3001)              |
| Build                      | `pnpm build`                        |
| Codegen                    | `pnpm codegen`                      |
| Schema sync (từ BE)        | `pnpm schema:sync` → `pnpm codegen` |
| Schedule DnD sync (từ web) | `pnpm schedule-dnd:sync`            |
| Print kernel sync (từ web) | `pnpm print-kernel:sync`            |
| Lint                       | `pnpm lint`                         |
| Typecheck                  | `pnpm typecheck`                    |

GraphQL schema: `../nalee-sports-backend/src/schema.gql` (hoặc `schema.gql` sau sync). Generated: `graphql/generated.ts` — **không sửa tay**.

## Verify

```bash
pnpm run verify:quick    # typecheck + copyright + size-gate:strict + dead-code-gate
pnpm run verify:a-plus   # + lint + test + build + check:shared-sync
pnpm run verify:go       # working-tree-clean + schema-drift + codegen-drift + verify:a-plus
pnpm run sync:shared     # pull shared kernel from web (manifest v1)
```

Sau đổi GraphQL documents: `pnpm schema:sync` (nếu cần) + `pnpm codegen` — 0 drift.

## Page pattern

```
app/.../page.tsx              # Shell mỏng (~40–150 lines)
  _hooks/use*Data.ts
  _hooks/use*Actions.ts
  _sections/*Section.tsx
```

God pages đã split (P4): schedule, draw, registrations, moderation. Mỗi file `app/**`, `components/**`, `hooks/**`, `lib/**` **≤ 400 effective lines** (size-gate ratchet).

## GraphQL

**Chuẩn:** `graphql/<domain>/{queries,mutations,fragments}.ts` — legacy `graphql/queries|mutations/` đã gỡ (Wave G).

- **Không** `gql` inline trong `app/` hoặc `components/`
- Dead-code gate: **0** orphan exports (`pnpm run dead-code-gate`)

### Pagination

- Cursor `*Connection` + helpers: `hooks/shared/useCursorConnection.ts`, `useInfiniteConnectionQuery.ts`, `usePagedConnectionQuery.ts`
- Data: `useConnectionLoadMore` + `mergeConnectionEdges` (append); `isLoadingMore` cho spinner fetchMore
- UI: **`ConnectionInfiniteScroll`** — mọi list/table cursor (IntersectionObserver sentinel, `rootMargin: 240px`)
- Optional: `DataTable` prop `infiniteScroll` để gắn footer không boilerplate
- `@deprecated`: `ConnectionPager`, `ConnectionLoadMore`, `Pagination` — không dùng cho table mới
- ESLint cấm `PaginationInput` / offset literals mới trong `hooks/**` (allowlist shrink dần)

### DataTable sort

- **Server-side** (cursor lists): `useDataTableSortUrl` + `toSortByOrder` / `toFinanceSortVariables` → connection hook truyền `$sort` → `buildSortedConnectionVariables` (kể cả `fetchMore`)
- **Client-side** chỉ dataset nhỏ đã load hết (portfolio, dashboard venues, growth aggregates)
- URL: `?sort=<field>&dir=asc|desc` (whitelist per page)
- Cột computed (`customerDisplayName`, `slots`, `actions`) → **không** `sortable`
- ADR: `docs/architecture/cursor-table-sort.md`

## Error handling

`format-graphql-error` + toast + `QueryState` + Apollo ErrorLink.

## Design system

Token-first — `config/theme.ts`, `ThemeProvider`. Atoms → molecules → organisms.

## Domain logic (`lib/tournament/`)

Schedule DnD kernel sync từ web — `pnpm schedule-dnd:sync`. Print kernel (`lib/tournament/print/`) sync từ web — `pnpm print-kernel:sync` (source: `nalee-sports-web/lib/tournament/print/`).

Routes in: `/admin/tournaments/[id]/print`, `/organizer/tournaments/[id]/print` (re-export).

## Audit

Wave 4 tracker: `docs/wave4-portal-audit.md`

## Commit

1 task = 1 commit. `refactor(portal): ...` / `chore(portal): ...`
