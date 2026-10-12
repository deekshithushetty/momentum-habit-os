# Momentum Habit Tracker

Momentum is a fresh, mobile-first habit tracker PWA built from scratch with React, Vite, Express, MongoDB, Redis, JWT authentication, IndexedDB offline storage, and installable Android Chrome support.

## Feature Inventory

The requested source ZIP was not modified. The local command runners available in this session failed before executing, so the archive could not be extracted for a verified inventory. The new implementation therefore includes the complete requested feature surface: authentication, protected user data, habit CRUD, schedule configuration, daily completion and undo, streaks, weekly progress, tasks, analytics, profile preferences, export, install guidance, Redis caching, PWA shell caching, offline cached reads, and queued offline completion sync.

## Architecture

```text
habit-tracker-v2/
  client/                 React + Vite PWA
    public/               Offline fallback and app icons
    src/components/       Navigation, habit cards, forms, sync agent
    src/context/          Authentication context
    src/hooks/            Online status and install prompt hooks
    src/layouts/          Auth and app shells
    src/pages/            Dashboard, habits, tasks, insights, profile, auth
    src/services/         API client and IndexedDB helpers
    src/styles/           Plain CSS design system
  server/                 Express API
    src/config/           Env, MongoDB, Redis
    src/controllers/      Route handlers
    src/middleware/       Auth and validation
    src/models/           User, Habit, Completion, Task
    src/routes/           Versioned API routes
    src/services/         Cache and dashboard services
    src/utils/            Date, streaks, errors
```

## Backend Features

- JWT registration, login, protected routes, session expiration handling.
- bcrypt password hashing.
- User-owned MongoDB models with indexes and duplicate completion prevention.
- REST API under `/api/v1`.
- Redis cache-aside for habits, dashboard summaries, and insights.
- Namespaced user-isolated cache keys: `habit-tracker:v1:user:{userId}:...`.
- Cache invalidation after habit and completion mutations.
- Redis failure fallback: API continues against MongoDB when Redis is unavailable.
- Basic cache metrics at `/api/v1/health`.
- Validation with Zod, Helmet, CORS, compression, rate limiting, and consistent errors.

## Frontend Features

- Mobile-first dark UI with bottom navigation and desktop sidebar.
- Login, registration, logout, protected routes, password visibility toggle.
- Dashboard with greeting, date, progress ring, today habit cards, streaks, weekly chart, and quick action.
- Habit creation, editing, archiving, emoji/color/category/schedule/reminder settings.
- One-tap completion and undo.
- Task planning with priority, due dates, completion, and deletion.
- Insights with date range, completion trend, weekday breakdown, habit performance, and streak summaries.
- Profile preferences, data export, notification preference placeholder, install guidance.
- Loading skeletons, empty states, error messaging, safe-area support, reduced-motion support.

## PWA and Offline

- Vite PWA manifest with standalone display, theme/background colors, app icons, and scope/start URL.
- Service worker caches the app shell and static assets.
- Offline fallback page at `/offline.html`.
- IndexedDB stores dashboard snapshots and queued completion operations.
- Offline completion operations include unique operation IDs and user IDs.
- `SyncAgent` retries queued operations when connectivity returns and removes synced operations only after server acknowledgement.
- Authenticated API responses are not stored in shared Cache Storage.

## Prerequisites

- Node.js 20+
- MongoDB running locally or a hosted MongoDB URI
- Redis running locally or a hosted Redis URL

## Environment

Copy `.env.example` to `server/.env` and adjust values:

```bash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/habit-tracker-v2
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

For the client, set `VITE_API_BASE_URL` when deploying somewhere other than `http://localhost:5000/api/v1`.

## Run Locally

```bash
npm run install:all
npm run dev
```

Or run services separately:

```bash
npm install --prefix server
npm run dev --prefix server
npm install --prefix client
npm run dev --prefix client
```

Open `http://localhost:5173`.

## Test and Build

```bash
npm test --prefix server
npm test --prefix client
npm run build --prefix client
```

The server tests cover streak logic and API health shape. The client test covers percentage utility behavior.

## Deployment

1. Build the client with `npm run build --prefix client`.
2. Deploy the `client/dist` folder to an HTTPS static host or serve it behind a reverse proxy.
3. Deploy the Express server with `NODE_ENV=production`, `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN` configured.
4. Use HTTPS in production; Android installation requires a secure origin except for localhost.
5. Configure the reverse proxy to send `/api/v1/*` to the server and all other routes to the client app.

## Android Installation

1. Open the deployed HTTPS URL in Google Chrome on Android.
2. Sign in and load the app once while online.
3. Tap the in-app install action when Chrome exposes it, or use Chrome menu > Add to Home screen / Install app.
4. Launch from the home screen for standalone mode.

## Troubleshooting

- If Redis is unavailable, `/api/v1/health` reports `redis: "unavailable"` and the API continues from MongoDB.
- If MongoDB is unavailable, the server cannot start because persistent storage is required.
- If offline operations do not sync, verify the user is logged in, the API URL is reachable, and queued operations belong to the active user.
