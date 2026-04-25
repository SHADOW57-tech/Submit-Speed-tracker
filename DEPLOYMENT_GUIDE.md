# 🚀 Deployment Guide - Submit Speed Tracking System

## Prerequisites

- Node.js v20.x or higher
- MongoDB Atlas account (or local MongoDB)
- Git
- Environment variables configured
- Hosting platforms (Vercel for frontend, Railway/Heroku for backend)

---

## 📋 Environment Setup

### Backend (.env)
```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/submitspeed?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS & Frontend
FRONTEND_URL=https://your-frontend-domain.com
# Development: http://localhost:5173

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env.local)
```bash
# API Backend
VITE_API_URL=https://your-backend-api.com
# Development: http://localhost:5000
```

---

## 🏗️ Build & Deployment Process

### Step 1: Prepare Backend

```bash
cd server

# Install dependencies
npm install

# Build/Check for errors
npm run build  # or just validate with: npm start (will error if issues)

# Verify .env is configured
cat .env  # Check all variables are set
```

### Step 2: Prepare Frontend

```bash
cd client

# Install dependencies
npm install

# Build production bundle
npm run build

# Verify build success
ls -la dist/  # Should contain index.html and assets/
```

### Step 3: Test Locally Before Deployment

```bash
# Terminal 1: Start backend
cd server
npm start
# Should output: "Server running on http://localhost:5000"
# And: "MongoDB connected to: submitspeed"

# Terminal 2: Test frontend (optional)
cd client
npm run dev
# Should output: "VITE v8.x.x ready in ..."
# Visit: http://localhost:5173
```

**Test Checklist**:
- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] Frontend loads without console errors
- [ ] Can login as admin
- [ ] Can view shipments
- [ ] Can add shipment updates
- [ ] Settings page loads

---

## ☁️ Deployment Options

### Option A: Railway + Vercel (Recommended)

#### Railway - Backend Deployment

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect your repository
   - Select `server` directory

3. **Configure Variables**
   - In Railway dashboard, go to Variables
   - Add all environment variables:
     ```
     MONGODB_URI=your_connection_string
     JWT_SECRET=your_secret_key
     FRONTEND_URL=https://your-vercel-domain.com
     NODE_ENV=production
     PORT=5000
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy Railway domain (e.g., `api-production-xyz.up.railway.app`)

#### Vercel - Frontend Deployment

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your repository
   - Select `client` directory as root

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: `client`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-railway-domain.up.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel builds automatically on push

---

### Option B: Heroku + Netlify

#### Heroku - Backend

1. **Create Heroku App**
   ```bash
   heroku create your-shipment-api
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set FRONTEND_URL=https://your-netlify-domain.com
   ```

2. **Deploy**
   ```bash
   git push heroku main
   heroku logs --tail  # Monitor deployment
   ```

#### Netlify - Frontend

1. **Connect Repository**
   - Visit https://netlify.com
   - Click "New site from Git"
   - Connect GitHub

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `client`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-heroku-domain.herokuapp.com
   ```

4. **Deploy**
   - Netlify automatically deploys on push

---

### Option C: Docker Containerization

#### Backend Dockerfile
```dockerfile
# server/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# client/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./server
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: http://localhost:3000
      NODE_ENV: production

  frontend:
    build:
      context: ./client
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## ✅ Post-Deployment Verification

### Check Backend Health
```bash
curl https://your-backend-domain.com/api/shipments
# Should return shipments (requires auth or public endpoint)

curl https://your-backend-domain.com/health
# Should return: { "status": "ok" }
```

### Check Frontend Load
```bash
# Visit https://your-frontend-domain.com
# Verify:
# - Page loads without 404 errors
# - Admin login page displays
# - Can navigate to track page
```

### Monitor Logs
```bash
# Railway
railway logs

# Vercel
vercel logs --follow

# Heroku
heroku logs --tail

# Netlify
netlify logs:function
```

---

## 🔒 Security Checklist

Before going to production, verify:

- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] `MONGODB_URI` uses Atlas IP whitelist
- [ ] `FRONTEND_URL` is correct (prevents CORS issues)
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets committed to repository
- [ ] HTTPS enabled on all domains
- [ ] CORS headers allow only your frontend domain
- [ ] Database backups enabled
- [ ] Error logs configured
- [ ] Rate limiting enabled (optional: express-rate-limit)

---

## 📊 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build
# Check dist/ folder size (should be <500KB)

# Enable compression
# Already configured in Vite
```

### Backend
```bash
# Enable caching headers
# Add to Express: app.use(express.static('public', { maxAge: '1d' }))

# Database indexing
# MongoDB indexes on frequently queried fields
db.shipments.createIndex({ "trackingNumber": 1 })
db.shipmentupdates.createIndex({ "shipmentId": 1 })
```

---

## 🐛 Troubleshooting

### "Cannot GET /api/shipments"
- Backend not running
- CORS not configured
- Wrong API URL in frontend

### "Cannot connect to MongoDB"
- Check connection string in .env
- Verify IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### "Blank page on frontend"
- Check browser console for errors
- Verify VITE_API_URL is correct
- Clear browser cache

### "Admin login fails"
- Backend not running
- Check JWT_SECRET matches between build environments
- Verify MongoDB has auth data

---

## 📈 Monitoring & Maintenance

### Set Up Alerts
- Email notifications for deployment failures
- Uptime monitoring (UptimeRobot.com)
- Error tracking (Sentry.io)

### Regular Maintenance
```bash
# Update dependencies monthly
npm update

# Security audit
npm audit fix

# Database cleanup
# Remove old shipments (optional archive)
```

### Backup Strategy
- Enable MongoDB Atlas backups
- Git repository backup (already on GitHub)
- Export critical data quarterly

---

## 🚀 Deployment Workflow

```
Local Development
    ↓
Commit & Push to GitHub
    ↓
CI/CD Pipeline Triggers
    ├─ Frontend: Vercel builds & deploys
    └─ Backend: Railway/Heroku builds & deploys
    ↓
Automated Tests Run
    ↓
Production Deployment Complete
    ↓
Monitor Logs & Metrics
```

---

## 📞 Support & Rollback

### If Something Goes Wrong
1. Check deployment logs
2. Verify environment variables
3. Check database connectivity
4. Rollback to previous version:
   ```bash
   vercel rollback  # Frontend
   heroku releases:rollback  # Backend
   ```

### Hotfix Process
1. Fix issue locally
2. Commit to main branch
3. Deployment triggers automatically
4. Verify in production

---

## 💡 Post-Launch Next Steps

1. **Monitor Performance**
   - Check API response times
   - Monitor database load
   - Track frontend bundle size

2. **Gather User Feedback**
   - Survey for usability
   - Track bug reports
   - Monitor error rates

3. **Plan Enhancements**
   - Real-time notifications
   - Mobile app
   - Advanced analytics
   - AI-powered insights

4. **Scale Infrastructure**
   - Add CDN for static assets
   - Database read replicas
   - API rate limiting
   - Load balancing

---

## 🎉 Deployment Complete!

Your shipment tracking system is now live and ready to serve users worldwide!

**Key Endpoints**:
- Frontend: `https://your-vercel-domain.com`
- API: `https://your-railway-domain.up.railway.app`
- Admin Dashboard: `https://your-frontend/admin`
- Public Tracking: `https://your-frontend/track`

**Next Steps**:
1. Share with stakeholders
2. Gather feedback
3. Monitor performance
4. Plan improvements
5. Scale as needed

Good luck! 🚀