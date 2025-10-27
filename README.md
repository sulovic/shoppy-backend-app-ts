# TypeScript version of the API (in TS/)

This folder contains a small TypeScript scaffold of the existing Express API. The original JavaScript project remains unchanged. This TS project is a starting point to migrate routes, controllers and types gradually.

Quick start

1. cd into the TS folder and install deps:

```bash
cd TS
npm install
```

2. Run in development mode (auto-reload):

```bash
npm run dev
```

3. Build and run:

```bash
npm run build
npm start
```

Notes
- The TS project uses `@prisma/client` — run `npx prisma generate` from the root/prisma setup if necessary.
- Env variables used: `PORT`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`.
- This scaffold includes a basic JWT login endpoint and a placeholder `/users` route protected by JWT middleware.

Next steps (recommended):
- Migrate controllers and routes one-by-one into `TS/src/controllers` and `TS/src/routes`.
- Add proper types for your domain models under `TS/src/models`.
- Wire the correct Prisma client if you use multiple generated clients in `prisma/*/client`.
