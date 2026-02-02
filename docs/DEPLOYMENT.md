# Knowtis Deployment Guide

This guide covers deploying Knowtis to production using Railway (backend) and Vercel (frontend).

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │     Railway     │
│   (Frontend)    │────▶│   (Backend)     │
│  React + Vite   │     │    NestJS       │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
               ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
               │PostgreSQL│ │  Redis  │ │WebSocket│
               │(Railway) │ │(Railway)│ │(Socket.io)│
               └──────────┘ └─────────┘ └──────────┘
```

## Prerequisites

- [Railway account](https://railway.app)
- [Vercel account](https://vercel.com) (already configured)
- GitHub repository connected to both platforms

## Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Empty Project"**
4. Name it: `knowtis` (or your preferred name)

## Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for deployment (~30 seconds)
4. Click on the PostgreSQL service
5. Go to **"Variables"** tab
6. Note the `DATABASE_URL` - Railway auto-generates this

## Step 3: Add Redis Database

1. Click **"+ New"** again
2. Select **"Database"** → **"Redis"**
3. Wait for deployment
4. The `REDIS_URL` will be available as a variable

## Step 4: Deploy Backend API

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your `knowtis` repository
3. Railway will detect `railway.toml` and configure automatically

### If Railway doesn't detect config automatically:

Go to **Settings** and configure:

| Setting            | Value                                              |
| ------------------ | -------------------------------------------------- |
| **Root Directory** | `/` (leave empty)                                  |
| **Build Command**  | `pnpm install --frozen-lockfile && pnpm build:api` |
| **Start Command**  | `node dist/apps/api/main.js`                       |

## Step 5: Configure Environment Variables

In your API service, go to **"Variables"** tab and add:

```bash
# Database (use Railway's reference syntax)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (use Railway's reference syntax)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT Secrets (generate with: openssl rand -hex 32)
JWT_SECRET=<your-32-char-hex-secret>
JWT_REFRESH_SECRET=<your-32-char-hex-secret>

# JWT Expiration
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS - Update with your Vercel frontend URL
CORS_ORIGIN=https://your-app.vercel.app

# Environment
NODE_ENV=production
PORT=3333

# Feature Flags (optional)
FF_REAL_TIME_COLLABORATION=true
FF_NOTE_SHARING=true
```

### Generate JWT Secrets

Run this command to generate secure secrets:

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate JWT_REFRESH_SECRET (run again)
openssl rand -hex 32
```

## Step 6: Generate Public Domain

1. Click on your API service
2. Go to **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Note your URL: `https://knowtis-api-production-xxxx.railway.app`

## Step 7: Configure Vercel Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `knowtis` project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add or update:

```bash
VITE_API_URL=https://your-railway-domain.railway.app
```

5. **Redeploy** the frontend for changes to take effect

## Step 8: Verify Deployment

### Test API Health

```bash
# Health check
curl https://your-api.railway.app/api/v1/health/ping

# Expected response:
# {"status":"ok","timestamp":"2026-01-13T..."}

# Readiness check (includes feature flags)
curl https://your-api.railway.app/api/v1/health/ready
```

### Test Frontend

1. Open your Vercel frontend URL
2. Try registering a new user
3. Try logging in
4. Create a new note
5. Open the same note in two tabs to test real-time collaboration

## Troubleshooting

### Build Fails

1. Check build logs in Railway
2. Verify `pnpm-lock.yaml` is committed
3. Ensure all dependencies are in `package.json`

### Database Connection Error

1. Verify `DATABASE_URL` uses `${{Postgres.DATABASE_URL}}` syntax
2. Check PostgreSQL service is running (green dot)
3. Ensure database migrations ran successfully

### CORS Errors

1. Verify `CORS_ORIGIN` matches your Vercel URL exactly
2. Include `https://` prefix
3. No trailing slash

### WebSocket Not Connecting

1. Verify Redis is running
2. Check `REDIS_URL` is configured
3. Verify frontend `VITE_API_URL` is correct

## Environment Variables Reference

| Variable                 | Required | Description                       |
| ------------------------ | -------- | --------------------------------- |
| `DATABASE_URL`           | Yes      | PostgreSQL connection string      |
| `REDIS_URL`              | Yes      | Redis connection for Socket.io    |
| `JWT_SECRET`             | Yes      | Access token signing key          |
| `JWT_REFRESH_SECRET`     | Yes      | Refresh token signing key         |
| `JWT_EXPIRES_IN`         | No       | Access token TTL (default: 15m)   |
| `JWT_REFRESH_EXPIRES_IN` | No       | Refresh token TTL (default: 7d)   |
| `CORS_ORIGIN`            | Yes      | Frontend URL for CORS             |
| `NODE_ENV`               | No       | Environment (default: production) |
| `PORT`                   | No       | Server port (default: 3333)       |

## Monitoring

### Railway Dashboard

- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History and rollback options

### Health Endpoints

| Endpoint               | Purpose                                |
| ---------------------- | -------------------------------------- |
| `/api/v1/health/ping`  | Simple liveness check                  |
| `/api/v1/health/ready` | Readiness with feature flags           |
| `/api/v1/health`       | Full health status with memory metrics |

## Costs

### Railway (Backend)

- **Free tier**: $5 credits/month
- **Estimated usage**: ~$5-15/month for small projects
- PostgreSQL and Redis included in usage

### Vercel (Frontend)

- **Free tier**: Generous for personal projects
- **Pro tier**: $20/month if needed

## Updating

### Backend Updates

Railway auto-deploys on push to `main` branch.

To manually redeploy:

1. Railway Dashboard → Your service
2. Click **"Deploy"** → **"Redeploy"**

### Frontend Updates

Vercel auto-deploys on push to `main` branch.

### Database Migrations

After schema changes, run migrations manually or add to build:

```bash
# In Railway service settings, update build command:
pnpm install --frozen-lockfile && pnpm db:push && pnpm build:api
```

---

## Quick Reference

```bash
# Generate secrets
openssl rand -hex 32

# Test health
curl https://your-api.railway.app/api/v1/health/ping

# View logs (Railway CLI)
railway logs
```
