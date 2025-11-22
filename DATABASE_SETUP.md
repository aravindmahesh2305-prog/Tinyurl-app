# Database Setup Guide

## Option 1: Neon (Recommended - Free & Easy)

Neon is a serverless PostgreSQL database that's perfect for this project.

### Steps:

1. **Sign up for Neon**
   - Go to https://neon.tech
   - Click "Sign Up" (you can use GitHub, Google, or email)
   - It's completely free!

2. **Create a New Project**
   - After signing in, click "Create Project"
   - Give it a name (e.g., "tinylink")
   - Choose a region close to you
   - Click "Create Project"

3. **Get Your Connection String**
   - Once your project is created, you'll see a connection string that looks like:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```
   - Click "Copy" to copy the connection string

4. **Update Your .env File**
   - Open the `.env` file in your project root
   - Replace the `DATABASE_URL` line with your Neon connection string:
     ```
     DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```
   - Save the file

5. **Restart Your Dev Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## Option 2: Railway (Alternative)

1. **Sign up for Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create a New Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"

3. **Get Connection String**
   - Click on the PostgreSQL service
   - Go to the "Variables" tab
   - Copy the `DATABASE_URL` value

4. **Update Your .env File**
   - Same as step 4 above

## Option 3: Local PostgreSQL (For Development)

If you have PostgreSQL installed locally:

1. **Create a Database**
   ```bash
   createdb tinylink
   ```

2. **Update .env File**
   ```
   DATABASE_URL=postgresql://localhost:5432/tinylink
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   (Adjust username/password if needed: `postgresql://username:password@localhost:5432/tinylink`)

## Testing the Connection

After setting up your database:

1. The tables will be created automatically on the first API call
2. Visit http://localhost:3000
3. Try creating a link - if it works, your database is connected!

## Troubleshooting

- **Connection Error**: Make sure your connection string is correct and includes `?sslmode=require` for Neon
- **SSL Error**: For Neon, SSL is required. The code handles this automatically in production
- **Table Creation Error**: Check that your database user has CREATE TABLE permissions

