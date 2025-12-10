# Netlify Deployment Setup Guide

Your app code has been pushed to GitHub: **https://github.com/taninigeria-aa/kifiapp**

## Step-by-Step Netlify Setup (Manual)

### 1. Create/Log into Netlify Account
- Go to https://app.netlify.com (create account if needed)
- Sign in with your Netlify account

### 2. Connect Your GitHub Repository
- Click **"New site from Git"** (or **"Add new site"**)
- Choose **GitHub** as your Git provider
- Authorize Netlify to access your GitHub account
- Select repository: `taninigeria-aa/kifiapp`

### 3. Configure Build Settings
The `netlify.toml` in your repo already configures:
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

Netlify will auto-detect these from `netlify.toml`. Just proceed with deployment.

### 4. Set Environment Variables (if needed)
If your frontend requires API endpoints, set in Netlify dashboard **Site settings → Build & deploy → Environment**:
- `VITE_API_URL` = your backend API URL (e.g., Railway/Render backend)

### 5. Deploy
- Click **"Deploy site"**
- Netlify will build from your repo automatically on every push to `main`

---

## Auto-Deployment on Push
Once connected, any push to `main` branch triggers a new build:
```bash
git push origin main
```

## Local Testing Before Deploy
To test locally:
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:5173/
```

## Production Build
Frontend is already built and ready:
```bash
cd frontend
npm run build  # Creates dist/ folder
```

---

## Netlify Status & Logs
Once deployed:
- View logs: **Site settings → Deploys**
- View live URL: Auto-generated `.netlify.app` domain
- Custom domain: **Site settings → Domain management**

---

## Next: Backend Deployment
For the backend API, you'll need to deploy to:
- Railway (https://railway.app)
- Render (https://render.com)
- Heroku (https://heroku.com) — free tier limited

The backend uses:
- Node.js + Express
- PostgreSQL (you'll need to provision a DB on the platform)
- Environment variables: `DATABASE_URL`, `PORT`, `JWT_SECRET`, etc.

Let me know if you need help setting up the backend hosting!
