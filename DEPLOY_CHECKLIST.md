# Vercel Deployment Checklist

## ✅ Pre-Deployment Checks

- [x] Build succeeds locally (`npm run build`)
- [x] All dependencies in `package.json`
- [x] `.gitignore` configured correctly
- [x] Database connection string ready

## 📋 Deployment Steps

### 1. Push to GitHub
```bash
# If git is not initialized
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

**Via Dashboard (Easiest):**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Add environment variables:
   - `DATABASE_URL` = Your Neon connection string
   - `NEXT_PUBLIC_APP_URL` = https://your-app.vercel.app (update after first deploy)
6. Click "Deploy"

**Via CLI:**
```bash
npm i -g vercel
vercel login
vercel
# Follow prompts, then:
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
vercel --prod
```

### 3. Environment Variables

**Required:**
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL

**Get Neon Connection String:**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Copy the connection string (use the pooler connection for serverless)

### 4. Post-Deployment

- [ ] Update `NEXT_PUBLIC_APP_URL` with actual Vercel URL
- [ ] Test `/healthz` endpoint
- [ ] Test creating a link
- [ ] Test redirect functionality
- [ ] Test click tracking
- [ ] Test delete functionality

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Console**: https://console.neon.tech
- **GitHub**: https://github.com

## 📝 Your Deployment URL

After deployment, your app will be available at:
```
https://your-project-name.vercel.app
```

Update this in your environment variables after first deployment!

