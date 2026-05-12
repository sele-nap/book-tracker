# 📚 Book Tracker

A cozy witchy grimoire to track your reading life — because a TBR pile is just a to-do list with better vibes.

## Stack

**Server**
- Node.js + TypeScript + Express
- MongoDB + Mongoose

**Client**
- React 19 + TypeScript
- Tailwind CSS v4 + Framer Motion
- Vite

## Run locally

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Fill in your env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start both server and client
cd .. && npm run dev
```

Server runs on `http://localhost:3000` · Client on `http://localhost:5173`