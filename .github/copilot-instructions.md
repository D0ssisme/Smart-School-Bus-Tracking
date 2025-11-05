## Smart School Bus — AI developer quick rules

This file gives concise, actionable guidance to editing and extending the Smart School Bus project so an AI coding agent is immediately productive.

1. Repo layout (quick mental model)
   - backend/ — Express API server (source in `backend/src`). Entry: `backend/src/server.js` (registers routes and starts the app).
   - backend/src/models — Mongoose models used by controllers.
   - backend/src/controllers — Request handlers, keep business logic here or in `services/` when complexity grows.
   - backend/src/routes — Route files; they are registered centrally in `server.js` via `app.use('/api/<name>', ...)`.
   - backend/src/config/db.js — DB connect helper; expects env var `MONGODB_CONNECTIONSTRING`.
   - frontend/ — Vite + React app. Dev entry: `npm run dev` (runs `vite`).

2. How code is structured / data flow
   - Frontend calls backend HTTP endpoints under `/api/*` (see `server.js` for the exact mounted paths: `/api/user`, `/api/login`, `/api/bus`, `/api/route`, `/api/routestop`, `/api/stop`, `/api/student`).
   - Backend uses Mongoose models and controllers: a typical change involves adding a model, a controller function, a route file, then registering that route in `server.js`.

3. Common editing patterns (concrete examples)
   - Add a new API resource `vehicle`:
     1. Create model `backend/src/models/Vehicle.js` (Mongoose schema + export).
     2. Create controller `backend/src/controllers/vehicleController.js` with CRUD functions.
     3. Create route file `backend/src/routes/vehicleRoutes.js` that maps endpoints to controller functions and exports an Express Router.
     4. Register the route in `backend/src/server.js`: `import vehicleRoutes from './routes/vehicleRoutes.js'; app.use('/api/vehicle', vehicleRoutes);`

   - Where to put logic: keep HTTP-level parsing and response shaping in controllers; heavier business logic or DB orchestration can go into `services/` (if present) or new files under `backend/src/services/`.

4. Environment and run notes (developer workflows)
   - Backend expects `MONGODB_CONNECTIONSTRING` in environment. There is a README reference to a `.env.example`, but it may be missing — set env locally or create one in `backend/`.
   - Backend scripts (from `backend/package.json`):
     - `npm run dev` -> `nodemon src/server.js` (use for iterative development)
     - `npm start` -> `node src/server.js` (production)
   - Frontend scripts (from `frontend/package.json`):
     - `npm run dev` -> `vite` (dev server)
     - `npm run build` -> `vite build`

   Example local start (two terminals):
   - Terminal A (backend):
     - cd backend; npm install; set MONGODB_CONNECTIONSTRING (or create .env); npm run dev
   - Terminal B (frontend):
     - cd frontend; npm install; npm run dev

5. Project-specific conventions and gotchas
   - The backend code uses ES module `import` syntax (see `backend/src/server.js`). Ensure Node is run in an environment that supports ES modules (project may expect `type: "module"` in package.json or Node >= v14+ with appropriate flags).
   - `server.js` centrally mounts all routes — add/remove route registrations here.
   - DB connection logic is in `backend/src/config/db.js` and will call `process.exit(1)` on connect failure; handle migrations/seed data accordingly (there is a `backend/seeder/seeder.js` file referenced in tree).
   - Frontend uses Vite + React; linting exists in frontend (`npm run lint`) but there are no obvious automated tests in the repo.

6. Integration & external dependencies
   - Backend depends on: express, mongoose, dotenv, cors, bcryptjs. Keep database calls via mongoose models.
   - Frontend depends on Vite, React and several UI libs; API calls are done with `axios` (see `frontend/src/lib` files).

7. Where to look for examples
   - Route registration and mount examples: `backend/src/server.js` (shows `app.use('/api/user', userRoutes)` etc.)
   - DB connection: `backend/src/config/db.js` (env var name `MONGODB_CONNECTIONSTRING`).
   - Models: `backend/src/models/*` (naming and schema examples).
   - Frontend app entry: `frontend/src/main.jsx` and `frontend/src/App.jsx` (React router and API client patterns).

8. Safety / review notes for AI edits
   - Do not change database connection env name without updating `.env` and deployment manifests.
   - Prefer minimal, isolated changes: add a route + controller + model and a single registration in `server.js` rather than broad refactors.
   - If you modify `package.json` to enable ESM (`type: "module"`) validate `npm run dev` still works.

If anything above is unclear or you'd like me to include additional examples (tests, typical controller unit tests, or a starter route + test), tell me which part to expand and I will iterate.
