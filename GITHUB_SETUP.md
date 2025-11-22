# Setting Up GitHub Repository

## Step 1: Create GitHub Repository

1. **Go to GitHub**
   - Visit: https://github.com
   - Sign in (or create an account if needed)

2. **Create New Repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Repository name: `tinylink` (or any name you prefer)
   - Description: "TinyLink - URL Shortener Application"
   - Choose: **Public** or **Private**
   - **DO NOT** check:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   - Click "Create repository"

3. **Copy the Repository URL**
   - You'll see a page with setup instructions
   - Copy the HTTPS URL (looks like: `https://github.com/YOUR_USERNAME/tinylink.git`)

## Step 2: Connect Local Repository to GitHub

Run these commands in your terminal (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You'll be prompted for your GitHub username and password/token.

### If you get authentication errors:

GitHub requires a Personal Access Token instead of password:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "TinyLink Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

## Step 3: Verify Push

After pushing, refresh your GitHub repository page. You should see all your files!

## Next: Deploy to Vercel

Once your code is on GitHub, you can deploy to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your `tinylink` repository
4. Add environment variables
5. Deploy!

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

