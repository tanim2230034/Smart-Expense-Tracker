# Smart Expense Tracker

A full-stack expense tracker built with React (Vite) and Express.

## Live Demo

- **Frontend (Vercel):** https://smart-expense-tracker-three-gamma.vercel.app
- **Backend API (Render):** https://smart-expense-tracker-elcs.onrender.com/api/health

> The backend runs on Render's free tier, so the first request after a period of inactivity can take 30-60 seconds.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Deployment:** Vercel (client), Render (server)

## Project Structure

- `client/`: React frontend
- `server/`: Express API

## Run Locally

```bash
# backend
cd server
npm install
npm start

# frontend (new terminal)
cd client
npm install
npm run dev
```

Create `client/.env` with `VITE_API_URL=http://localhost:5000`.