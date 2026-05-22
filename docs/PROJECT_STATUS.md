# Aalgorix World Academy — Engineering Source of Truth

**Repository:** `aalgorix-world-academy`  
**Document version:** 1.0  
**Last updated:** May 2026  
**Status:** Phase 0–1 complete · Production builds passing · Billing deferred to finale

---

## 1. Executive Summary & Tech Stack

### 1.1 Product Definition

**Aalgorix World Academy** is a premium, highly scalable EdTech platform and Learning Management System (LMS) modeled on the pedagogical and commercial workflows of [CambriLearn](https://www.cambrilearn.com). The system targets four distinct actor classes—**Students**, **Parents**, **Teachers**, and **Admins**—within a single academy tenant, with curriculum delivery, gated content progression, assignment lifecycles, and (eventually) subscription-gated enrollment.

The platform is being constructed as a **modular monolith** on Next.js, with PostgreSQL row-level security as the authoritative authorization plane and Supabase as the managed backend substrate.

### 1.2 Technology Stack (Authoritative)

| Layer | Technology | Version / Notes |
|-------|------------|-----------------|
| **Application framework** | Next.js (App Router) | 16.2.x |
| **Language** | TypeScript | 5.x, strict mode |
| **UI runtime** | React | 19.2.x |
| **Compiler optimization** | React Compiler | Enabled via `reactCompiler: true` in `next.config.ts` and `babel-plugin-react-compiler` |
| **Styling** | Tailwind CSS | v4 (`@import "tailwindcss"`, `@theme inline` in `globals.css`) |
| **Component library** | shadcn/ui | **Planned** — not yet initialized; auth UI currently uses bespoke Tailwind primitives |
| **Database** | PostgreSQL (Supabase) | Foundation migration deployed |
| **Auth** | Supabase Auth | Email/password, Google OAuth, password recovery |
| **Object storage** | Supabase Storage | Buckets documented; policies pending Phase 3+ |
| **SSR auth bridge** | `@supabase/ssr` | Cookie-backed server/browser client split |
| **Payments** | Stripe (tiered subscriptions) | **DEFERRED TO FINAL PHASE** — schema primitives exist (`subscription_tiers`, `subscriptions`); no application code yet |

### 1.3 Environment Contract

Configuration is driven by `.env.local` (see `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; webhooks in finale)
- Stripe keys (reserved, unused until finale)
- `NEXT_PUBLIC_APP_URL`

---

## 2. Completed Milestones (What Is Done)

All items below have been implemented and verified via successful `npm run build` (Next.js 16 Turbopack production compilation).

### 2.1 Phase 0 — Foundation & Data Plane

#### Database architecture

Foundational schema deployed through:

`supabase/migrations/20250521000000_foundation.sql`

**Core entities (deployed):**

| Table | Responsibility |
|-------|----------------|
| `profiles` | 1:1 extension of `auth.users`; `user_role` enum: `student`, `parent`, `teacher`, `admin` |
| `student_parent_relations` | Guardianship graph; `is_primary_billing_contact` for future Stripe owner mapping |
| `subscription_tiers` | Plan catalog (Stripe price IDs) — data model only |
| `subscriptions` | Parent-owned billing records — data model only |
| `courses` | Top-level curriculum; `unlock_strategy` (`sequential`, `drip`, `all_at_once`, `manual`) |
| `course_modules` | Ordered units within a course |
| `lessons` | Video/resource metadata; `is_preview` for marketing teasers |
| `enrollments` | Student ↔ course access contract |
| `content_unlocks` | Per-enrollment lesson availability (sequential/drip/manual) |
| `lesson_progress` | Watch state; feeds sequential unlock engine |
| `assignments` | Homework metadata; `max_points` default 100 |
| `submissions` | Student uploads; `grade` 0–100; teacher `feedback` |
| `teacher_course_assignments` | Scopes teacher grading to assigned courses |

**Database automation:**

- `handle_new_user()` trigger on `auth.users` INSERT → auto-provisions `public.profiles` with `role` and `full_name` from `raw_user_meta_data`
- `set_updated_at()` triggers on mutable tables

#### Security shell (Row-Level Security)

RLS is **enabled on all public tables**. Authorization is enforced through **security definer** SQL helpers:

| Function | Purpose |
|----------|---------|
| `is_admin()` | Elevated platform operators |
| `is_teacher()` | Teachers and admins |
| `parent_has_student(uuid)` | Parental line-of-sight to child records |
| `student_is_enrolled_in_course(uuid)` | Enrollment gate for assignments |
| `student_is_enrolled_in_lesson(uuid)` | Lesson visibility via module graph |
| `lesson_is_unlocked_for_student(uuid)` | `content_unlocks` + preview lesson bypass |

**Policy highlights:**

- Students read only active enrollments, unlocked lessons, and own submissions (write while `draft` / `returned`)
- Parents read linked children’s enrollments, progress, submissions (grades read-only)
- Teachers mutate grades only when `teacher_course_assignments` matches assignment course
- Admins hold override policies on management tables

Cross-tenant isolation is achieved by binding every query to `auth.uid()` and graph-aware helper functions—not application-layer filters alone.

---

### 2.2 Phase 1 — Auth, Identity & Edge Routing

#### Supabase SSR client layer

| File | Runtime | Responsibility |
|------|---------|----------------|
| `src/lib/supabase/client.ts` | Browser | `createBrowserClient` singleton for Client Components |
| `src/lib/supabase/server.ts` | Server | `createServerClient` with `cookies()` read/write for RSC, Actions, Route Handlers |
| `src/lib/supabase/middleware.ts` | Edge (proxy) | Session refresh + authorization routing |
| `src/lib/env.ts` | Isomorphic | Validates Supabase URL and anon/publishable key |

#### Edge routing gate (Next.js 16 Proxy)

Network-level protection is implemented via the **Next.js 16 proxy convention** (successor to legacy `middleware.ts`):

- **Entry:** `src/proxy.ts` — exports `proxy()` and `config.matcher`
- **Logic delegate:** `src/lib/supabase/middleware.ts` → `updateSession()`

**Proxy responsibilities:**

1. Instantiate per-request Supabase server client with full `getAll` / `setAll` cookie bridging (prevents stale JWT and random logout bugs).
2. Call `supabase.auth.getUser()` to refresh session material on every matched navigation.
3. **Unauthenticated guard:** Redirect to `/login?next=…` when accessing `/student`, `/parent`, `/teacher`, `/admin`.
4. **Authenticated auth-page guard:** Redirect signed-in users away from `/login`, `/signup`, `/forgot-password` to role home—**except** `/reset-password` (recovery completion surface).
5. **Role prefix enforcement:** Prevent horizontal privilege movement (e.g., student cannot browse `/parent/*`).

#### Multi-tenant authentication (identity flows)

| Flow | Route(s) | Mechanism |
|------|----------|-----------|
| Email/password signup | `/signup` | `signUp()` with `options.data.role` + `full_name` → DB trigger |
| Email/password login | `/login` | `signInWithPassword()` → profile role lookup → dashboard redirect |
| Google OAuth SSO | `/login` | `signInWithOAuth({ provider: 'google' })` → `/auth/callback` |
| Forgot password | `/forgot-password` | `resetPasswordForEmail()` → email deep link |
| Reset password | `/reset-password` | `updateUser({ password })` after recovery session established |
| OAuth / recovery callback | `/auth/callback` | `exchangeCodeForSession()` with **`next` param precedence** |

**Auth callback priority (critical):**

```
1. safeRedirectPath(next)   → e.g. /reset-password
2. getDashboardPathForRole(profile.role)
3. Fallback: /
```

Implemented in `src/app/auth/callback/route.ts` with open-redirect hardening via `safeRedirectPath()` in `src/lib/auth/redirects.ts`.

#### Auth UI surfaces (Tailwind v4)

- Shared chrome: `src/components/auth/auth-shell.tsx`
- Login: `src/app/(auth)/login/login-form.tsx` (Google button, forgot-password link, email form)
- Signup: `src/app/(auth)/signup/page.tsx` (role selector: Student / Parent / Teacher)
- Recovery: `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/reset-password/page.tsx`
- Sign-out: `src/components/auth/sign-out-button.tsx`

#### Dashboard stubs (redirect targets only)

Minimal Server Component placeholders exist to validate routing—not product dashboards:

- `/student`, `/parent`, `/teacher`, `/admin` under `src/app/(dashboard)/`

---

## 3. Directory Structure Map

**Implemented tree (Phase 0–1 reality):**

```
aalgorix-world-academy/
├── docs/
│   ├── ARCHITECTURE.md          # Target full-repo layout & original phase plan
│   └── PROJECT_STATUS.md        # This document (engineering source of truth)
├── supabase/
│   └── migrations/
│       └── 20250521000000_foundation.sql
├── .env.local.example
├── next.config.ts               # reactCompiler: true
├── package.json
├── src/
│   ├── proxy.ts                 # ◄ Next.js 16 edge proxy entry (session + RBAC routing)
│   ├── app/
│   │   ├── layout.tsx           # Root HTML shell, Geist fonts, metadata
│   │   ├── globals.css          # Tailwind v4 @theme tokens
│   │   ├── page.tsx             # Public landing (login/signup CTAs)
│   │   │
│   │   ├── (auth)/              # ◄ Unauthenticated auth UX (route group, no URL segment)
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   ├── page.tsx     # Suspense boundary
│   │   │   │   └── login-form.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── (dashboard)/         # ◄ Authenticated shell (session required)
│   │   │   ├── layout.tsx       # Server-side getUser() gate
│   │   │   ├── student/page.tsx
│   │   │   ├── parent/page.tsx
│   │   │   ├── teacher/page.tsx
│   │   │   └── admin/page.tsx
│   │   │
│   │   └── auth/
│   │       └── callback/route.ts  # ◄ PKCE / OAuth / recovery code exchange
│   │
│   ├── components/auth/         # Presentational auth primitives
│   ├── lib/
│   │   ├── env.ts
│   │   ├── auth/
│   │   │   ├── roles.ts         # Role enums + signup whitelist
│   │   │   └── redirects.ts     # Dashboard paths, safeRedirectPath, recovery exceptions
│   │   └── supabase/
│   │       ├── client.ts        # Browser Supabase client
│   │       ├── server.ts        # Server Supabase client
│   │       └── middleware.ts    # updateSession() — consumed by proxy.ts
│   └── (no src/middleware.ts — superseded by proxy.ts in Next.js 16)
```

### Layer purposes (inline reference)

| Path | Layer | Purpose |
|------|-------|---------|
| `src/proxy.ts` | **Edge network gate** | Executes before route handlers; refreshes Supabase cookies; enforces authentication and role-prefix alignment on every matched request. |
| `src/lib/supabase/` | **Data access adapters** | Framework-correct SSR cookie bridging. Separates browser vs server runtimes per Supabase guidance. |
| `src/lib/auth/` | **Authorization vocabulary** | Pure TypeScript role types and path algebra—keeps proxy and callback logic DRY. |
| `src/app/(auth)/` | **Identity acquisition** | Sign-in, registration, and credential recovery without exposing dashboard chrome. |
| `src/app/(dashboard)/` | **Role-scoped product surface** | Future home for LMS workflows; currently stubbed post-auth landing zones. |
| `src/app/auth/callback/` | **Auth handshake termination** | Converts OAuth/recovery `code` query param into HTTP-only session cookies. |

---

## 4. Identity Merging & Security Logic

### 4.1 Automatic identity linking (Supabase Auth)

Supabase Auth maintains a single canonical row in `auth.users` per human operator. When **Automatic Identity Linking** is enabled (recommended production default), the following reconciliation rules apply:

| Scenario | Behavior |
|----------|----------|
| User registers with email/password, later signs in with **Google using the same verified email** | Supabase links the Google provider identity to the existing user UUID. **No duplicate `profiles` row** is created because the `handle_new_user` trigger fires only on INSERT. |
| User first signs in with Google, later sets a password on the same account | Email identity attaches to the same `auth.users.id`; profile row remains stable. |
| Conflicting unverified emails across providers | Linking is blocked until verification converges—protects account takeover. |

**Engineering implications for Aalgorix:**

1. **`profiles.id` is the immutable foreign key** for enrollments, submissions, and billing (future). All application queries must key off `auth.uid()` → `profiles.id`, never email strings.
2. **Role metadata on Google-first users:** OAuth sign-in does not pass `role` in `user_metadata` unless configured via Auth Hooks or post-login onboarding. Google-only users default to `student` per `handle_new_user()` until an admin or onboarding flow updates `profiles.role`.
3. **Password recovery on linked accounts:** `resetPasswordForEmail` targets the unified user; recovery callback uses `?next=/reset-password` so users complete rotation before dashboard redirect.
4. **RLS remains correct after merge:** Policies reference `auth.uid()`, which is stable across provider linkage—no orphaned submission rows.

### 4.2 Defense-in-depth summary

```
┌─────────────────────────────────────────────────────────────┐
│  Browser / Client Component (@supabase/ssr browser client)   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  src/proxy.ts  — session refresh + route RBAC                  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  Server Components / Route Handlers (server client + RLS)    │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  PostgreSQL RLS — authoritative data plane authorization     │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. The Forward-Looking Roadmap

Phases are ordered for **vertical slice delivery**. **Stripe billing is intentionally deferred to the finale** so curriculum and pedagogy features can be validated against real enrollments seeded administratively.

| Phase | Name | Scope | Primary deliverables |
|-------|------|-------|----------------------|
| **0** | Foundation | ✅ **Complete** | SQL migration, RLS shell, architecture docs |
| **1** | Auth & Identity | ✅ **Complete** | SSR clients, proxy gate, email/Google OAuth, password recovery, role routing |
| **3** | Course Catalog & Storage | 🔜 Next | Admin course CRUD (`courses` → `course_modules` → `lessons`), Supabase Storage buckets + policies, published curriculum on marketing surface |
| **4** | Student LMS Workspace | 🔜 Planned | Interactive course player, recursive sidebar navigation tree, HTML5 video element, assignment submission dropzone, `content_unlocks` engine tied to `lesson_progress` |
| **5** | Teacher Portal & Grading Queue | 🔜 Planned | Homework downloads from Storage, feedback logs, 0–100 grade indexing, `teacher_course_assignments` scoped queues |
| **6** | Parent Performance Dashboard | 🔜 Planned | Multi-child selector dropdowns, aggregate progress trackers, read-only grading report access via `parent_has_student()` RLS |
| **7** | Back-Office Management Catalog | 🔜 Planned | Admin interfaces for curriculum editing, user provisioning, instructor-to-course mapping, enrollment administration |
| **2 (FINALE)** | Stripe Subscription Integration | 🔜 **Last** | Checkout Sessions, Customer Portal, signed webhooks (`service_role`), `subscriptions` + `enrollments` activation sync, tier gating |

### 5.1 Phase dependency graph (logical)

```
Phase 0 ──► Phase 1 ──► Phase 3 (Catalog)
                              │
                              ▼
                         Phase 4 (Student LMS)
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              Phase 5 (Teacher)   Phase 6 (Parent)
                    │                   │
                    └─────────┬─────────┘
                              ▼
                         Phase 7 (Admin CMS)
                              │
                              ▼
                    Phase 2 FINALE (Stripe)
```

### 5.2 Explicitly out of scope (current sprint)

- shadcn/ui component installation and design system tokens
- Stripe Checkout, webhooks, and `api/webhooks/stripe`
- Marketing route group `(marketing)` beyond minimal `/` landing
- Real-time messaging, live classes, quiz engine, certificates
- Multi-organization white-label tenancy

---

## Appendix A — Quick verification checklist

| Check | Command / action |
|-------|------------------|
| Production compile | `npm run build` |
| Local dev | `npm run dev` → `http://localhost:3000` |
| DB tables | Supabase Table Editor → 13 `public` tables |
| Google OAuth | `/login` → Continue with Google → role dashboard |
| Password recovery | `/forgot-password` → email → `/reset-password` → dashboard |
| Proxy active | Build output lists `ƒ Proxy (Middleware)` |

## Appendix B — Related documentation

| Document | Location |
|----------|----------|
| Target architecture & full future tree | `docs/ARCHITECTURE.md` |
| Database DDL + RLS source | `supabase/migrations/20250521000000_foundation.sql` |
| Agent / Next.js 16 conventions | `AGENTS.md` |

---

*This file is the engineering source of truth for repository state. Update it at the completion of each phase.*
