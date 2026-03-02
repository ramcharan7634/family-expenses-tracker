# Family Expenses Tracker - Deployment Guide

## ✅ Changes Made

1. **Prisma Schema Updated**: Changed from SQLite to PostgreSQL
   - File: `prisma/schema.prisma`
   - Provider: `postgresql`
   - URL: `env("DATABASE_URL")`

2. **API Route Fixed**: Updated search functionality for PostgreSQL compatibility
   - File: `app/api/records/route.ts`

3. **Prisma Client Generated**: Ready for PostgreSQL

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Create Neon PostgreSQL Database

1. **Go to Neon**: Visit [neon.tech](https://neon.tech)
2. **Sign Up**: Create a free account (GitHub OAuth)
3. **Create Project**:
   - Click "Create Project"
   - Name: `family-expenses-tracker`
   - Select region closest to you
4. **Get Connection String**:
   - Click "Connection Details"
   - Select "Pooled connection" (recommended for serverless)
   - Copy the connection string - it looks like:
     
```
     postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
     
```

### Step 2: Push Code to GitHub

```
bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Update for PostgreSQL deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/family-expenses-tracker.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com)
2. **Sign In**: Use your GitHub account
3. **Add Project**: Click "Add New" → "Project"
4. **Import Repo**: Select your GitHub repository
5. **Configure**:
   - Framework Preset: `Next.js`
   - Build Command: Leave blank (default)
   - Output Directory: Leave blank (default)
6. **Environment Variables**: Click "Environment Variables" and add:
   - Variable: `DATABASE_URL`
   - Value: Paste your Neon connection string
7. **Deploy**: Click "Deploy"

### Step 4: Run Database Migration

After deployment, you need to push your schema to the production database:

**Option A: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Link to project
vercel link

# Pull environment variables
vercel env pull .env

# Run Prisma migration (optional - schema push is enough)
npx prisma db push
```

**Option B: Via Neon Console**
1. Go to your Neon project
2. Use the "Table Editor" to verify connection

**Option C: Use a Post-Deployment Script**
Add this to your `package.json` scripts:
```
json
"deploy": "next build && npx prisma db push"
```

### Step 5: Verify Deployment

1. Visit your Vercel deployment URL
2. Test adding a new record
3. Check the dashboard shows data
4. Test the analytics page
5. Test Excel upload functionality

---

## 🔧 Troubleshooting

### Common Issues

1. **"Cannot connect to database"**
   - Verify `DATABASE_URL` is set correctly in Vercel
   - Ensure Neon project is active (not paused)
   - Check SSL mode is enabled in connection string

2. **"Relation does not exist"**
   - Run `npx prisma db push` to create tables

3. **Build fails**
   - Ensure `npx prisma generate` runs during build
   - Add to `package.json`: `"postinstall": "prisma generate"`

### Quick Fix for Build

Add this to your `package.json`:

```
json
"scripts": {
  "postinstall": "prisma generate",
  "build": "next build"
}
```

---

## 📝 Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ Yes |

---

## 🎉 Deployment Complete!

Your Family Expenses Tracker should now be live with:
- ✅ Vercel hosting (frontend + API)
- ✅ Neon PostgreSQL database
- ✅ Excel upload functionality
- ✅ Analytics & Dashboard
- ✅ All API routes working

**Live URL**: `https://your-project-name.vercel.app`
