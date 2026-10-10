# Kabadi Connect

> **Status:** Supabase Auth and several user, recycler, pickup, rewards, document review, reports, and leaderboard flows are integrated. Society aggregate screens, some public impact/presentation areas, database integration tests, and hosted-project validation remain incomplete. Do not use this build for production operations until the remaining items and the SQL migration have been validated.

**Turn Waste Into Value.**

Kabadi Connect is a hackathon frontend that digitally connects **households**, **kabadiwalas / recyclers**, **housing societies** and **admins**. Users book pickups, recyclers accept and complete them, and everyone sees the waste journey, impact, Green Points and leaderboards update live.

## Features

- Premium dark cyan/navy landing site with animated counters, 3D-tilt hero, waste categories, featured recyclers, challenge preview and journey preview
- Auth UI: Supabase login, registration, password reset, Google OAuth, validation and actionable errors
- **User**: dashboard, find recycler (filters + map-style view), 8-step pickup request wizard, my pickups, animated **waste journey** tracking, history, estimated impact dashboard, Green Points and rewards, leaderboard, profile/settings, notifications, help
- **Recycler**: dashboard, incoming requests (accept/reject), active pickups (on the way, collected, next stage, completed), transactions, earnings charts, editable rates, verification, ratings, settings
- **Society**: dashboard, households, analytics, challenge
- **Admin**: dashboard, users, recyclers (verification approvals), societies, pickup requests, reports
- Reusable component system, responsive layouts, skeleton loaders, empty states, toasts, modals, accessible forms, custom 404

## Tech stack

React 18, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion, Lucide React. Charts are lightweight custom SVG components (no chart library).

## Install and run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173). Configure `.env.local` and the Supabase project first; see [SUPABASE_SETUP.md](SUPABASE_SETUP.md). Build with `npm run build`.

## Backend setup and verification

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for local environment setup, Auth provider configuration, migrations, admin provisioning, authorization notes, and known gaps. Never put a service-role key in Vite environment variables.

## Important routes

```
/  /find-recycler  /recyclers/:id  /how-it-works  /impact  /leaderboard
/login  /register  /forgot-password  /reset-password
/about  /contact  /privacy  /terms  /help

/user/dashboard  /user/find-recycler  /user/request-pickup  /user/pickups  /user/pickups/:id
/user/history  /user/impact  /user/rewards  /user/leaderboard  /user/profile  /user/notifications  /user/help

/recycler/dashboard  /recycler/requests  /recycler/pickups  /recycler/transactions  /recycler/earnings
/recycler/rates  /recycler/verification  /recycler/ratings  /recycler/settings

/society/dashboard  /society/households  /society/analytics  /society/challenge
/admin/dashboard  /admin/users  /admin/recyclers  /admin/societies  /admin/requests  /admin/reports
```

## Folder structure

```
src/
  components/   shared UI (ui.jsx, charts.jsx, Journey, Navbar, Footer, Logo, modals...)
  context/      Supabase session, role-scoped data, and persisted mutations
  data/         static presentation assets/catalogue labels; legacy demo exports must not be used as operational records
  hooks/        useLoading (skeleton state)
  layouts/      PublicLayout, DashboardLayout (sidebar + mobile drawer)
  pages/        public/ auth/ user/ recycler/ society/ admin/
  routes/       AppRoutes (lazy loaded), Guard (role-based mock guard)
  utils/        formatting helpers, estimated-impact factors, icon registry
```

## Data safety

- Role guards improve navigation only. PostgreSQL RLS and trusted RPCs must remain the authorization boundary.
- Pickup estimates are recalculated by the database using the selected recycler's active rate. Cash payments are not processed by this application.
- Environmental figures are **estimates** from illustrative per-kg factors in `utils/index.js`, not audited measurements.

## Images

Photos load from Unsplash URLs (see `IMG` in `src/data/mock.js`). If one fails to load, the `Img` component automatically shows a themed SVG placeholder, so no image area is ever blank. Swap any URL in `mock.js` for your own asset if you prefer.
