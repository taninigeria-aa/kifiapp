# Railway Backend Deployment Guide

Your backend is configured and ready for deployment to Railway!

## Prerequisites
- Railway account (free tier available): https://railway.app
- GitHub repository already connected: `taninigeria-aa/kifiapp`

## Step-by-Step Deployment

### 1. Create a New Project on Railway
- Go to https://railway.app/dashboard
- Click **"Create New Project"**
- Select **"Deploy from GitHub repo"**
- Authorize Railway to access your GitHub
- Select repository: `taninigeria-aa/kifiapp`

### 2. Add Services
Railway will automatically detect and deploy the backend based on `railway.json`.

#### a) PostgreSQL Database Service
- In your Railway project, click **"+ Add"** → **"Database"** → **"PostgreSQL"**
- Railway creates a PostgreSQL instance automatically
- Get the connection string from the service (will be in format: `postgresql://user:pass@host:port/dbname`)

#### b) Backend Service (Node.js)
- Railway auto-detects the Node.js backend
- Or manually add: **"+ Add"** → **"GitHub Repo"** → select `taninigeria-aa/kifiapp`
- Railway will:
  - Build using the Dockerfile in `backend/`
  - Start with `npm start` command
  - Expose port 3000

### 3. Configure Environment Variables
In your Railway project dashboard:
1. Click the **Backend service** (or Node.js service)
2. Go to **"Variables"** tab
3. Add the following environment variables:

```
PORT=3000
NODE_ENV=production
DATABASE_URL=<copy from PostgreSQL service variables>
JWT_SECRET=<generate a secure random string>
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

**To get DATABASE_URL:**
- Click the **PostgreSQL service**
- Go to **"Variables"**
- Copy the `DATABASE_URL` value
- Paste it into the Backend service variables

**JWT_SECRET:**
Generate a secure random string (e.g., using `openssl rand -hex 32`):
```bash
openssl rand -hex 32
```
Or use any strong password generator.

### 4. Link Backend & Frontend
Once the backend is deployed on Railway:
1. Get the backend API URL from Railway (e.g., `https://your-service.railway.app`)
2. Go to **Netlify dashboard** → Your frontend site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Add variable: `VITE_API_URL=https://your-railway-backend-url`
5. Trigger a redeploy (push to GitHub or manually redeploy in Netlify)

### 5. Initialize the Database
Once deployed, you'll need to run database migrations/setup:

#### Option A: Using Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Log in
railway login

# In your project directory
railway run npm run setup-phase7
# (or whichever setup script initializes your schema)
```

#### Option B: Manually via Dashboard
1. In Railway, click your Backend service
2. Go to **"Deployment"** → **"Logs"**
3. Once the service is running, click the service name to open a shell
4. Run the setup script:
   ```bash
   npm run setup-phase7
   ```

#### Option C: Initialize Schema Directly
If you have a schema.sql file, you can:
1. Connect to the PostgreSQL service from Railway (get host/port from Variables)
2. Run:
   ```bash
   psql -U <user> -h <host> -p <port> -d <dbname> -f database/schema.sql/
   ```

### 6. Monitor & Logs
- **Logs**: Service → "Logs" tab (shows build and runtime logs)
- **Metrics**: Service → "Metrics" tab (CPU, memory, request count)
- **Health**: Check `/api/health` endpoint

## Quick Reference

| Component | URL | Status |
|-----------|-----|--------|
| Frontend (Netlify) | `https://your-site.netlify.app` | Live |
| Backend (Railway) | `https://your-service.railway.app` | Live |
| API Health | `https://your-service.railway.app/api/health` | Check health |

## Environment Variables Summary

**Backend (.env in Railway):**
```
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=<your-secure-string>
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

**Frontend (Netlify build vars):**
```
VITE_API_URL=https://your-railway-backend-url
```

## Troubleshooting

### Build Fails
- Check **Logs** tab in Railway service
- Ensure `npm run build` works locally: `cd backend && npm run build`

### Database Connection Error
- Verify `DATABASE_URL` is correct in service Variables
- Check PostgreSQL service is running (status should be "Sleeping" or "Running")
- Ensure backend can reach the database host/port

### Frontend Can't Reach Backend
- Check `VITE_API_URL` is set in Netlify environment
- Ensure backend is publicly accessible (not restricted by network)
- Check CORS headers in backend (`app.ts` already has `cors()` enabled)

### Health Check Fails
- Run: `curl https://your-railway-backend-url/api/health`
- Should return: `{"status":"ok","timestamp":"2025-12-10T...Z"}`

## Auto-Deployment
Once configured, any push to `main` branch triggers:
- **Netlify**: Frontend rebuild & redeploy (~1-2 min)
- **Railway**: Backend rebuild & redeploy (~2-5 min)

No manual steps needed!

---

**Need help?** Feel free to ask. You can also check Railway docs: https://docs.railway.app
