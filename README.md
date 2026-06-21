# 📚 Book Tracker

A cozy witchy grimoire to track your reading life, because a TBR pile is just a to-do list with better vibes.

## Stack

**Server**

- Node.js + TypeScript + Express 5
- MongoDB + Mongoose (aggregations, text index, TTL index)
- JWT authentication (httpOnly cookies)
- Zod validation

**Client**

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- SWR for data fetching
- Recharts
- React Router v7
- Phosphor Icons

**Tests**

- Cypress E2E

## Run locally

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Configure environment
cp server/.env.example server/.env
# Fill in MONGO_URI, JWT_SECRET, PORT

# Seed test data (optional)
cd server && npm run seed
# Creates test@booktracker.dev / password123 with sample SF/Fantasy books

# Start both server and client
bash scripts/dev.sh
```

Server → `http://localhost:3000` · Client → `http://localhost:5173`

## E2E Tests

Requires the app to be running locally.

```bash
cd client

# Interactive mode
npm run cy:open

# Headless mode
npm run cy:run
```

Tests cover: auth, library, book detail, reading, settings.

## Project structure

```
book-tracker/
├── server/
│   ├── controllers/    # Route handlers (Gedeon naming: getUser*, postUser*)
│   ├── services/       # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── middleware/     # requireAuth
│   ├── validators/     # Zod schemas
│   └── scripts/        # seed.ts
└── client/
    ├── src/
    │   ├── pages/      # Route-level components (~100 lines)
    │   ├── components/ # Reusable UI components
    │   ├── api/        # Fetch wrappers
    │   ├── hooks/      # useAuth, useLanguage, useToast
    │   └── i18n/       # FR/EN translations
    └── cypress/        # E2E tests
```
