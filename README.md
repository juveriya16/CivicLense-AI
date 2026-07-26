# CivicLens — Citizen Module (Frontend)

Smart Civic Issue Reporting & Management System — Citizen-facing frontend, built to a premium SaaS
standard (Apple / Stripe / Linear / Notion / Vercel–inspired), on mock data only.

> This build contains **only the Citizen experience**. There is no Officer or Admin dashboard, and no
> role selection anywhere in the app — every signed-in user is treated as a Citizen.

## Tech stack

React 19 · Vite · Tailwind CSS v4 · React Router v7 · Framer Motion · React Hook Form · Axios ·
TanStack Query · Leaflet / React-Leaflet · Chart.js · Socket.io-client · React Icons · Lucide Icons

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## What's included

- **Welcome page** — animated hero, live stats, project intro
- **Auth** — Login, multi-step Signup (account → security → location → review), Forgot Password
  (email → OTP → reset → success)
- **Citizen Dashboard** — greeting, profile/contribution card, live stat cards, weekly activity chart,
  category breakdown, recent reports, interactive Leaflet city map, weather widget, nearby issues,
  city updates, notification bell, dark mode toggle, command palette (Cmd+K), floating "Lens" AI assistant
- **Report Issue** — drag & drop + camera capture upload, mock AI detection card (type / confidence /
  severity / duplicate warning), category picker, GPS detection with map, description, success animation
- **My Reports** — search, status tabs, category filters, sorting, empty state
- **Track Complaint** — animated status timeline, progress bar, AI prediction card, map, images, comments
- **Profile** — editable fields, badges, contribution score, level progress, leaderboard rank, change
  password modal
- **Notification Center** — filters, unread badge, mark-as-read, animated cards
- **Settings** — dark/light mode, language, location permission, notification preferences, profile
  visibility, delete account, logout
- **Shared UI** — responsive sidebar + bottom nav, topbar with search, command palette, floating action
  button, floating AI assistant, toast notifications, skeleton loaders, empty states, 404 page

## Folder structure

```
src/
  components/
    common/     Navbar, Sidebar, Topbar, FAB, CommandPalette, StatusChip, ReportCard, etc.
    charts/     Chart.js wrappers (weekly activity, category breakdown)
    map/        Leaflet city map
  context/      Auth, Theme, Toast providers (mock — swap for real API calls later)
  features/     One folder per page/flow (auth, dashboard, report, myReports, trackComplaint,
                profile, notifications, settings)
  mock/         All mock JSON-like data — replace with real API responses
  routes/       ProtectedRoute wrapper
  App.jsx       Router setup
  index.css     Design tokens (colors, type, glass/viewfinder styles) + Tailwind v4 theme
```

## Design system

- **Colors**: Navy (`navy-950`...`navy-50`) + white + orange accent (`orange-500` `#ff6b2c`)
- **Type**: Bebas Neue for display/headlines, Inter for body text
- **Signature motif**: a camera-"viewfinder" corner-bracket treatment (`.viewfinder` class in
  `index.css`) used on the hero illustration, upload dropzone, and 404 page — a nod to "Lens"
- All colors/spacing/shadows are defined as CSS variables in `src/index.css` under `@theme`, so
  re-theming is a one-file change.

## Wiring up a real backend

Every page currently reads from `src/mock/*.js`. To connect a real API:

1. Replace the mock imports with TanStack Query hooks (`useQuery`/`useMutation`) calling your Axios client.
2. Swap `AuthContext`'s `login`/`signup`/`logout` for real API calls (JWT storage, etc.).
3. Point `CityMap` at live report coordinates from your backend instead of `mock/reports.js`.
4. Wire `FloatingAssistant` and the AI Detection card in Report Issue to your real vision-model endpoint.
5. Add a Socket.io client instance in `AppShell` for live notification pushes.

## Notes

- No Officer/Admin pages, routes, or role logic exist in this codebase by design.
- All data (users, notifications, city-wide stats) is mock data in `src/mock/`.
- `mock/reports.js` is intentionally **empty** — it's the citizen's own filed reports, meant to be
  replaced by a real `GET /api/reports` call. The shape each report should follow is documented as a
  comment at the top of that file.
- Dark mode is class-based (`.dark` on `<html>`), driven by CSS variables in `index.css` that flip
  under `.dark { ... }` — most components auto-theme because they use the semantic tokens
  (`bg-surface`, `bg-card`, `text-ink`, `border-line`, etc.) instead of hardcoded colors.
- Language switching (`LanguageContext` + `mock/translations.js`) is real, not decorative — it covers
  navigation, Settings, Dashboard, My Reports, Notifications, and Profile. Add more keys to
  `translations.js` to extend coverage to Welcome/Login/Report Issue copy.
- **Location** uses the real browser Geolocation API plus OpenStreetMap Nominatim for reverse
  geocoding (`src/hooks/useCurrentLocation.js`) — no more mock coordinates.
- **Camera** uses `getUserMedia` with a live preview and front/back camera switching
  (`src/components/common/CameraCapture.jsx`) instead of relying on the file input's `capture`
  attribute, which desktop browsers ignore.
