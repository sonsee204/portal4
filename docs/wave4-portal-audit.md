# Wave 4 Portal Audit — NALee Sports (Jun 2026)

> **Purpose:** Track portal A+ gates (excluding test expansion). Update after each ratchet commit.

---

## Verdict (live)

| Gate | Status | Notes |
|------|--------|-------|
| `tsc` | GO | strict |
| `lint` | GO | ~20 warnings, 0 errors |
| `size-gate:strict` | IN PROGRESS | baseline: **6 error**, **18 warn** @250L → target 0/≤5 |
| `dead-code-gate` | GO | **0** orphan GraphQL exports |
| `check:codegen-drift` | GO | in `verify:go` |
| `check:schema-drift` | GO | in `verify:go` |
| `verify:go` | GO | local |
| `build` | GO | |

**Grade target:** A (sát A+) — excluding vitest/CI test gate per Wave 4 scope.

---

## Completed waves

| Wave | Item | Status |
|------|------|--------|
| P1–P2 | AGENTS, rules, size-gate, mock cleanup | GO |
| P3 | Cursor `*Connection` hooks + shared helpers | GO |
| P4 | God page split (schedule, draw, registrations, moderation) | GO |
| P5 | Schedule DnD lib sync + dead-code 0 | GO |
| A | Governance: schema-drift, CI dead-code-gate, ESLint pagination guard | GO |

---

## Size-gate tracker (error tier)

| File | Effective L | Status |
|------|-------------|--------|
| `tournaments/_form/_steps/StepCategories.tsx` | 912 | pending C1 |
| `registrations/_components/LateEntryModal.tsx` | 656 | pending C3 |
| `settings/.../OtpTestPhoneRegistrySettings.tsx` | 489 | pending C6 |
| `(auth)/forgot-password/.../ForgotPasswordForm.tsx` | 465 | pending C5 |
| `lib/apollo/client.ts` | 436 | pending C4 |
| `tournaments/_form/_parts/CategoryFormCard.tsx` | 401 | pending C2 |

---

## Size-gate tracker (warn tier — top)

| File | Effective L | Status |
|------|-------------|--------|
| `OtpTestUserGrantSettings.tsx` | 395 | pending F |
| `StepReview.tsx` | 360 | pending F |
| `ScheduleTimelineView.tsx` | 299 | pending B |
| `TournamentFormWizard.tsx` | 300 | pending F |
| `RegistrationsTableSection.tsx` | 318 | pending F |

---

## Human QA (pre-push)

- [ ] Schedule grid DnD + auto-scroll
- [ ] Schedule list filter
- [ ] Admin tables ConnectionPager
- [ ] Tournament form categories step
- [ ] Late entry modal 4 steps
