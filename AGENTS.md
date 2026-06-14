# NALee Sports Portal — Agent Guide

Next.js 16 + Apollo Client + Tailwind 4. TypeScript **strict**. Package manager: **pnpm** (`pnpm@10.26.2`).

Admin dashboard (port **3001**). Bề mặt lớn nhất trong stack FE (~389 file). `lib/tournament/` sync từ web qua `pnpm schedule-dnd:sync` — **không** fork logic schedule/DnD riêng.

## Stack & lệnh chạy

| Mục | Lệnh |
|-----|------|
| Dev | `pnpm dev` (port 3001) |
| Build | `pnpm build` |
| Start prod local | `pnpm start` |
| Codegen | `pnpm codegen` |
| Schema sync (từ BE) | `pnpm schema:sync` → `pnpm codegen` |
| Schedule DnD sync (từ web) | `pnpm schedule-dnd:sync` |
| Lint | `pnpm lint` |
| Format | `pnpm run format` |
| Typecheck | `pnpm typecheck` |
| Icons | `pnpm icons:sync` |
| Version sync | `pnpm version:sync` |

GraphQL schema: `../nalee-sports-backend/src/schema.gql` (hoặc `schema.gql` sau sync). Generated: `graphql/generated.ts` — **không sửa tay**.

## Verify (chạy sau mỗi thay đổi)

```bash
pnpm typecheck
pnpm lint
pnpm run size-gate:strict
pnpm build
pnpm run verify:quick    # pre-push: typecheck + copyright + size-gate:strict
pnpm run verify:a-plus   # typecheck + copyright + lint + size-gate:strict + build
pnpm run verify:go       # working-tree-clean + codegen drift + verify:a-plus
```

Sau đổi GraphQL documents: `pnpm schema:sync` (nếu cần) + `pnpm codegen` — 0 drift.

## Page pattern (bắt buộc cho page mới / split)

Port từ mobile `VenueDetail` → App Router. Reference mỏng: `app/(dashboard)/tournaments/[id]/page.tsx`.

```
app/.../page.tsx              # Shell mỏng (~100–150 lines)
  _hooks/use*Data.ts          # Queries, derived state, permissions
  _hooks/use*Actions.ts       # Mutations, navigation, modals
  _sections/*Section.tsx      # Hoặc components/organisms/ khi shared
```

**Anti-pattern (đang refactor P4):** god page — `schedule/page.tsx` (~689L), `draw/page.tsx` (~889L), `registrations/page.tsx` (~694L), `moderation/page.tsx` (~820L). Tách `_hooks/` + `_sections/`.

- Logic thuần → `lib/tournament/` hoặc `*.derived.ts` (thêm vitest khi P4)
- Fat page >150 effective lines → split ngay
- Mỗi file `app/**`, `components/**`, `hooks/**`, `lib/**` **≤ 400 effective lines** (size-gate sau F2; baseline ratchet)

## GraphQL

**Đích:** `graphql/<domain>/{queries,mutations,fragments}.ts`

**Hiện tại (legacy):** `graphql/queries/`, `graphql/mutations/`, `graphql/fragments/`, `graphql/subscriptions/` — migrate dần theo domain (`tournament`, `admin`, `moderation`, `contact`, …).

- Types: `import type { XQuery, XQueryVariables } from '@/graphql/generated'`
- Hooks: `hooks/<domain>/use*.ts` import documents từ `graphql/`
- **Không** `gql` inline trong `app/` hoặc `components/`
- **Không** god file GraphQL (>400L) — tách theo domain
- Sau đổi schema BE: `pnpm schema:sync` + `pnpm codegen`

### Pagination

- Cursor `*Connection` + `edges` / `pageInfo` — **cấm offset mới** `{ page, limit }`
- **Nợ hiện tại (~13 hook):** `hooks/admin/*`, `hooks/tournament/useTournamentScheduleMatches.ts`, `hooks/notification/useNotifications.ts`, `hooks/contact/useContactInquiries.ts`, … — migrate P3 khi BE có `*Connection`
- Helper cursor: port từ `nalee-sports-mobile/src/hooks/shared` khi cần

## Error handling

Tái dùng stack đã sync portal↔landing↔web:

- `lib/errors/format-graphql-error.ts`
- `lib/toast.ts` + `components/providers/ToastProvider.tsx` (sonner)
- `components/molecules/QueryState` — loading / error / empty
- Apollo ErrorLink trong `lib/apollo/client.ts`
- Mutations: `formatMutationError` từ `hooks/shared` + toast

## Design system

Atomic design — `components/atoms/` → `molecules/` → `organisms/` → `templates/`:

- Layout: `templates/DashboardLayout`, `GlassPanel`, `StatCard`
- `QueryState`, `Modal`, `ConfirmDialog`, `Pagination` (cursor sau P3)
- Theme: `components/providers/ThemeProvider.tsx` + `config/theme.ts` — không hardcode hex/rgb
- Strings: `lib/strings/` — không hardcode copy admin dài trong JSX
- Permissions: `lib/permissions` + `PermissionGate` — không bypass RBAC trong page
- Icons: `public/svg/` (`pnpm icons:sync`)

## Domain logic (`lib/tournament/`)

- Schedule DnD, bracket helpers — logic thuần tách khỏi page
- Sync từ web: `pnpm schedule-dnd:sync` — **không** sửa bản web-only trong portal
- Thay đổi schedule lib → sync web trước, rồi chạy sync script

## Dead code (đang dọn P2+)

- GraphQL orphan ops (~25) — chạy dead-code-gate khi thêm script (wave sau)
- `app/(dashboard)/cms/page.tsx` — **tính năng thật** (`useAdminAllBookings`, `useAuditLogs`); giữ nguyên

## Cấm

- `any` type — `no-explicit-any: error`
- `@ts-nocheck` / `@ts-ignore` mới
- `gql` inline rải rác — gom `graphql/<domain>/`
- Offset pagination mới `{ page, limit }`
- God file > 400 effective lines (đang ratchet baseline — siết dần)
- Sửa tay `graphql/generated.ts`
- Mock types (`types/mock.ts`) cho data production — dùng generated types (file đã xoá P2)
- Hardcode hex/rgb trong JSX — dùng Tailwind token / theme
- Copy/sửa logic schedule từ web thủ công — dùng `schedule-dnd:sync`
- File source mới không có copyright header Ao Trình — `pnpm run check:copyright-header`

Repo này **không** chứa DB migrations — chạy qua `nalee-sports-migrations/` trước backend deploy khi đổi schema.

## Commit

```
feat(portal): ...
fix(portal): ...
refactor(portal): ...
chore(portal): ...
```

1 task = 1 commit. Không push cho đến khi verify pass.
