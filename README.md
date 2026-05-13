# 📚 Book Tracker

A cozy witchy grimoire to track your reading life — because a TBR pile is just a to-do list with better vibes.

## Stack

**Server**

- Node.js + TypeScript + Express
- MongoDB + Mongoose (aggregations, text index, TTL index)

**Client**

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Recharts
- React Router v7

## Run locally

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Create your env file
cp server/.env.example server/.env
# Fill in MONGO_URI and PORT

# Start both server and client
bash scripts/dev.sh
```

Server runs on `http://localhost:3000` · Client on `http://localhost:5173`
