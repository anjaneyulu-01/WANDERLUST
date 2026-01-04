# Wanderlust - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Security](#security)
6. [Troubleshooting](#troubleshooting)
7. [Environment Variables Reference](#environment-variables-reference)

---

## Quick Start

### Local Development (3 steps)
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit with your credentials
nano .env

# 3. Start the app
npm start
```

### Production Deployment (Quick Version)
1. Set environment variables in your hosting platform
2. Deploy your code (don't deploy `.env` file)
3. Done!

---

## Environment Setup

### Prerequisites
- Node.js 14+ 
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

### Required Credentials

#### 1. MongoDB Atlas (Database)
- Go to https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?appName=Wanderlust`

#### 2. Cloudinary (Image Storage)
- Go to https://cloudinary.com/console
- Copy: Cloud Name, API Key, API Secret
- Image uploading needs all three values

#### 3. Session Secret (Encryption)
- Generate with: `openssl rand -base64 32`
- Must be different for each environment
- Keep it private and strong

---

## Local Development

### Step 1: Setup Environment File
```bash
cp .env.example .env
```

### Step 2: Edit `.env` with Your Credentials
```dotenv
# Environment Configuration
NODE_ENV=development
PORT=3006

# Database Configuration
ATLAS_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust?appName=Wanderlust

# Session Configuration
SESSION_SECRET=your_generated_secret_here_32_chars_minimum

# Cloudinary Configuration (Image Storage)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Development Server
```bash
npm start
```

Server runs at `http://localhost:3006`

### Step 5: Initialize Database (Optional)
```bash
node init/index.js
```

This populates the database with sample data and test users.

---

## Production Deployment

### Platform: Heroku

```bash
# 1. Create Heroku app
heroku create your-app-name

# 2. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set ATLAS_DB_URL="mongodb+srv://..."
heroku config:set SESSION_SECRET="$(openssl rand -base64 32)"
heroku config:set CLOUD_NAME="your_name"
heroku config:set CLOUD_API_KEY="your_key"
heroku config:set CLOUD_API_SECRET="your_secret"

# 3. Deploy
git push heroku main

# 4. View logs
heroku logs --tail
```

### Platform: AWS Elastic Beanstalk

```bash
# 1. Create environment variables file
mkdir -p .ebextensions
cat > .ebextensions/environment.properties << EOF
NODE_ENV=production
PORT=3006
ATLAS_DB_URL=mongodb+srv://...
SESSION_SECRET=your_strong_secret
CLOUD_NAME=your_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
EOF

# 2. Deploy
eb init
eb create wanderlust-env
eb deploy
```

### Platform: Azure App Service

```bash
# 1. Create app service
az webapp create --resource-group myGroup --plan myPlan --name wanderlust-app

# 2. Set environment variables
az webapp config appsettings set --resource-group myGroup --name wanderlust-app \
  --settings NODE_ENV=production \
  ATLAS_DB_URL="mongodb+srv://..." \
  SESSION_SECRET="your_secret" \
  CLOUD_NAME="your_name" \
  CLOUD_API_KEY="your_key" \
  CLOUD_API_SECRET="your_secret"

# 3. Deploy
git push azure main
```

### Platform: Docker & Kubernetes

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 3006
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t wanderlust .
docker run -e NODE_ENV=production \
           -e ATLAS_DB_URL="..." \
           -e SESSION_SECRET="..." \
           -e CLOUD_NAME="..." \
           -e CLOUD_API_KEY="..." \
           -e CLOUD_API_SECRET="..." \
           -p 3006:3006 \
           wanderlust
```

### Platform: DigitalOcean App Platform

```yaml
# app.yaml
name: wanderlust
services:
- name: web
  github:
    repo: your-username/wanderlust
    branch: main
  build_command: npm install
  run_command: npm start
  environment_slug: node-js
  http_port: 3006
  envs:
  - key: NODE_ENV
    value: production
  - key: ATLAS_DB_URL
    value: ${DB_URL}
  - key: SESSION_SECRET
    value: ${SESSION_SECRET}
  - key: CLOUD_NAME
    value: ${CLOUD_NAME}
  - key: CLOUD_API_KEY
    value: ${CLOUD_API_KEY}
  - key: CLOUD_API_SECRET
    value: ${CLOUD_API_SECRET}
```

---

## Security

### What Was Fixed ✅

All secrets are now in environment variables, NOT hardcoded:

| Item | Before | After |
|------|--------|-------|
| Cloudinary Secret | Hardcoded ❌ | `process.env.CLOUD_API_SECRET` ✅ |
| Database URL | Hardcoded ❌ | `process.env.ATLAS_DB_URL` ✅ |
| Session Secret | Hardcoded ❌ | `process.env.SESSION_SECRET` ✅ |
| Port | Hardcoded ❌ | `process.env.PORT` ✅ |

### Security Checklist

Before deploying to production:
- [ ] Generate new SESSION_SECRET: `openssl rand -base64 32`
- [ ] Use production MongoDB URL
- [ ] Use production Cloudinary credentials
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS on server
- [ ] Whitelist server IP in MongoDB Atlas
- [ ] Verify `.env` is in `.gitignore`
- [ ] Do NOT commit `.env` file
- [ ] Use different secrets for each environment

### Important Reminders

1. **Never commit `.env`** - It's in `.gitignore` for protection
2. **Share `.env.example`** - This is the template (safe)
3. **Generate strong secrets** - At least 32 random characters
4. **Rotate secrets** - Annually or when team members leave
5. **Use platform secrets** - Not file-based for production

---

## Troubleshooting

### "Cannot Connect to MongoDB"

**Check these:**
```bash
# 1. Verify connection string format
# Should be: mongodb+srv://username:password@cluster.mongodb.net/dbname?appName=Wanderlust

# 2. Verify IP whitelist in MongoDB Atlas
# Go to: Security → Network Access → Add your IP

# 3. Test connection with MongoDB Compass
# Download from: https://www.mongodb.com/products/compass
```

### "Cloudinary Upload Fails"

**Check these:**
```bash
# 1. Verify all three credentials are correct:
echo $CLOUD_NAME
echo $CLOUD_API_KEY
echo $CLOUD_API_SECRET

# 2. Check credentials at: https://cloudinary.com/console

# 3. Verify folder exists: wanderlust/listings
```

### "Port Already in Use"

```bash
# Linux/Mac: Kill the process
lsof -ti:3006 | xargs kill -9

# Windows: Change PORT in .env to 3007 or 8080
```

### "Session Secret Not Set"

```bash
# 1. Verify it's in .env
cat .env | grep SESSION_SECRET

# 2. Regenerate if needed
openssl rand -base64 32

# 3. Restart server after changing .env
```

### "Dependencies Not Installed"

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables Reference

### Required Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` or `production` | Environment mode |
| `PORT` | `3006` | Server port number |
| `ATLAS_DB_URL` | `mongodb+srv://...` | MongoDB connection string |
| `SESSION_SECRET` | `rJxv7kL9mN2pQr4sT...` (32+ chars) | Session encryption key |
| `CLOUD_NAME` | `dkvvwjara` | Cloudinary cloud name |
| `CLOUD_API_KEY` | `985912544373157` | Cloudinary API key |
| `CLOUD_API_SECRET` | `t9XvYKBLm1QC4q2q...` | Cloudinary API secret |

### Optional Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `TEST_USERS` | `[{"username":"user1",...}]` | Custom test users (JSON) |
| `MAPBOX_TOKEN` | `your_token` | For enhanced mapping features |

### Environment Variable Format Examples

**ATLAS_DB_URL:**
```
mongodb+srv://username:password@cluster0.mongodb.net/wanderlust?appName=Wanderlust
```

**SESSION_SECRET:**
```
Generate with: openssl rand -base64 32
Example: rJxv7kL9mN2pQr4sT6uVwXyZ1aB3cD5eF7gH9iJ0kL
```

**CLOUD_NAME:**
```
Find at: https://cloudinary.com/console
```

---

## Key File Locations

```
Project Structure:
├── app.js                 ← Main application
├── .env                   ← Your local secrets (git-ignored)
├── .env.example          ← Template to copy
├── config/
│   └── cloudinary.js      ← Image storage config
├── controllers/           ← Business logic
├── models/               ← Database schemas
├── routes/               ← API routes
├── views/                ← EJS templates
└── init/
    └── index.js          ← Database initialization
```

---

## Common Commands

```bash
# Start development server
npm start

# Initialize database with sample data
node init/index.js

# View environment variables (local)
cat .env

# Test if port is available
lsof -i :3006

# Generate strong secret
openssl rand -base64 32
```

---

## Support & Resources

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Cloudinary:** https://cloudinary.com/console
- **Heroku:** https://dashboard.heroku.com
- **AWS:** https://console.aws.amazon.com
- **Node.js:** https://nodejs.org

---

## Summary

Your Wanderlust application is now:
- ✅ **Secure** - All secrets in environment variables
- ✅ **Clean** - Code quality improved
- ✅ **Documented** - Complete setup guide
- ✅ **Flexible** - Works on any platform
- ✅ **Production-Ready** - Enterprise standards

**Next Step:** Copy `.env.example` to `.env` and get started! 🚀
