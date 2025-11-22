# Deploying TinyLink to Vercel

This guide will help you deploy your TinyLink application to Vercel.

## Prerequisites

1. **GitHub Account** - You'll need to push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **Neon Database** - Your database should already be set up

## Step 1: Prepare Your Code

### 1.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - TinyLink application"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `tinylink` (or any name you prefer)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository (`tinylink`)
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables**
   - Click "Environment Variables"
   - Add the following:
   
   ```
   DATABASE_URL=your_neon_connection_string_here
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```
   
   **Important**: 
   - Get your Neon connection string from [Neon Console](https://console.neon.tech)
   - The `NEXT_PUBLIC_APP_URL` will be your Vercel URL (you can update it after first deployment)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? No
   - Project name: tinylink
   - Directory: ./
   - Override settings? No

4. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   # Paste your Neon connection string
   
   vercel env add NEXT_PUBLIC_APP_URL
   # Enter: https://your-app-name.vercel.app
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Update Environment Variables

After your first deployment, you'll get a Vercel URL like:
`https://tinylink-abc123.vercel.app`

1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
4. Redeploy (or it will auto-redeploy on next push)

## Step 4: Verify Deployment

1. **Check Health Endpoint**
   - Visit: `https://your-app.vercel.app/healthz`
   - Should return: `{"ok": true, "version": "1.0", "uptime": ...}`

2. **Test Dashboard**
   - Visit: `https://your-app.vercel.app/`
   - Should show the dashboard

3. **Test Creating a Link**
   - Create a short link
   - Verify it works

4. **Test Redirect**
   - Click on a short link
   - Should redirect and increment clicks

## Troubleshooting

### Build Fails

1. **Check Build Logs**
   - Go to Vercel dashboard → Deployments
   - Click on failed deployment
   - Check the build logs

2. **Common Issues**
   - **Database connection error**: Check `DATABASE_URL` is correct
   - **TypeScript errors**: Run `npm run build` locally first
   - **Missing dependencies**: Check `package.json`

### Database Connection Issues

1. **Check Neon Connection String**
   - Make sure it includes `?sslmode=require`
   - Verify it's the pooler connection string (for serverless)

2. **Test Connection**
   - Use Neon's SQL editor to verify database is accessible

### Environment Variables Not Working

1. **Redeploy After Adding Variables**
   - Environment variables require a new deployment
   - Go to Deployments → Redeploy

2. **Check Variable Names**
   - Must be exactly: `DATABASE_URL` and `NEXT_PUBLIC_APP_URL`
   - Case-sensitive

## Post-Deployment

### Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Monitoring

- Vercel provides built-in analytics
- Check Function Logs for API errors
- Monitor database connections in Neon dashboard

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard
**Neon Console**: https://console.neon.tech
**GitHub**: https://github.com

---

**Your deployment URL will be**: `https://your-project-name.vercel.app`

