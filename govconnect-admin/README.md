# GovConnect Admin

Admin console for triaging citizen complaints — built with Vite + React and
Supabase (Postgres, Auth, Realtime). No mock or hardcoded data: every page
reads and writes through the Supabase client in `src/lib/supabaseClient.js`.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/schema.sql`. This creates:
   - `profiles` (roles: `super_admin` / `admin`, plus `is_approved`)
   - `complaints`, `complaint_duplicates`, `notifications`, `routing_settings`
   - a trigger that auto-creates a `profiles` row for every new signup
   - Row Level Security policies enforcing the role rules below
3. Copy `.env.example` to `.env` and fill in your project URL + anon key.

## 2. Run it

```bash
npm install
npm run dev
```

## 3. Auth & roles

- Signup is restricted to **@gov.in** email addresses, checked both in the
  browser (`isAllowedGovEmail` in `supabaseClient.js`) and again server-side
  in the `handle_new_user` trigger, so it can't be bypassed by calling the
  API directly.
- Every new signup is created as `role = 'admin'`, `is_approved = false`.
  They can't sign in until approved.
- **Only a `super_admin` can approve a pending request or revoke access**,
  from **Admin management** (`/admin-management`). Regular admins don't see
  that page at all — it's hidden from the sidebar and hard-guarded by
  `RequireSuperAdmin`, and the underlying `profiles` update is also blocked
  by an RLS policy, not just hidden in the UI.
- There is **no way to create a `super_admin` from the app**. Granting that
  role from the browser would require a service-role key on the client,
  which would let anyone read/write the whole database — a real security
  hole. Instead, seed your first super admin directly in SQL after they've
  signed up once:

  ```sql
  update public.profiles
  set role = 'super_admin', is_approved = true
  where email = 'first.employee@gov.in';
  ```

  From then on, that person approves everyone else through the UI.

## 4. Pages

- **Dashboard** — live stats + complaints-by-category chart
- **Complaints** — filterable table, click a row to open the detail drawer
- **Duplicate review** — pending complaint pairs flagged by proximity, confirm/dismiss
- **Hotspots** — Leaflet map of located complaints, colored by priority
- **Notifications** — per-user feed, realtime, mark read/unread
- **Settings** — per-category SLA hours + duplicate-detection radius (super admin edits, everyone reads)
- **Admin management** — super admin only: approve signups, revoke access

## 5. Layout notes

- The sidebar (`src/components/layout/Sidebar.jsx`) uses `.app-sidebar` in
  `src/index.css`: `position: sticky; top: 0; height: 100vh`, inside a flex
  row where only `<main>` scrolls. That's what keeps it pinned to the full
  height of the viewport regardless of how short its nav list is or how far
  you scroll the page content.
