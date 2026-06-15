# Wave 4 Portal Audit — NALee Sports (Jun 2026)

> **Purpose:** Track portal A+ gates (excluding test expansion).

---

## Verdict

| Repo | Maintainability | TypeScript | CI/CD | **Grade** |
|------|-----------------|------------|-------|-----------|
| **Portal** | `size-gate:strict` **0 error**, **15 warn** @250L | `tsc` pass | dead-code @ **0**, schema-drift, codegen-drift in verify:go | **A-** |

Stretch: warn → ≤5 (form wizard, settings) — Wave 5 backlog.

---

## Automated gates

| Gate | Status |
|------|--------|
| `tsc` | GO |
| `lint` | GO (0 errors, ~21 warnings) |
| `size-gate:strict` | GO — **error: 0**, **warn: 15** baseline |
| `dead-code-gate` | GO — **0** orphan GraphQL exports |
| `check:codegen-drift` | GO |
| `check:schema-drift` | GO |
| `verify:go` | GO (local, clean tree) |
| `build` | GO |
| `test` | Out of Wave 4 scope |

---

## Waves completed

| Wave | Item | Status |
|------|------|--------|
| P3 | Cursor `*Connection` hooks | GO |
| P4 | God page split | GO |
| P5 | DnD kernel sync + dead-code 0 | GO |
| A | Governance: schema-drift, CI, ESLint pagination guard | GO |
| B | Schedule hooks facade (no ScheduleTimelineView god) | GO |
| C | Size-gate error tier 6 → **0** | GO |
| D | ConnectionPager + admin cursor UI | GO |
| E | GraphQL domain folders | GO |
| F | Warn tier 18 → **15** (partial) | GO |

---

## Size-gate (warn tier remaining)

| File | Effective L |
|------|-------------|
| OtpTestUserGrantSettings.tsx | 395 |
| StepReview.tsx | 360 |
| CategoryApiCardEditForm.tsx | 357 |
| ProvisionPlayerDialog.tsx | 319 |
| TournamentFormWizard.tsx | 300 |
| ReferralCodeManager.tsx | 299 |
| StepRegistration.tsx | 297 |
| StepScheduleVenue.tsx | 279 |
| PartnerLeaderboard.tsx | 274 |
| TournamentStatusActions.tsx | 274 |
| ProfileSettings.tsx | 264 |
| VenueRequestDetail.tsx | 264 |
| RegistrationDetailModal.tsx | 258 |
| venue-requests/page.tsx | 256 |
| NotificationDropdown/index.tsx | 252 |

---

## Human QA (pre-push)

- [ ] Schedule grid DnD + auto-scroll
- [ ] Schedule list filter
- [ ] Admin tables ConnectionPager (users, audit, cms, moderation, venue/claim)
- [ ] Tournament form categories step
- [ ] Late entry modal 4 steps
- [ ] Forgot password 3-step flow

---

## Related docs

- Shared package proposal: [`docs/architecture/schedule-dnd-shared-package.md`](../../docs/architecture/schedule-dnd-shared-package.md)
- Monorepo audit: [`docs/refactor/wave2-a-plus-audit.md`](../../docs/refactor/wave2-a-plus-audit.md)
