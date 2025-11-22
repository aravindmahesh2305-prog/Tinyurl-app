# TinyLink Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Database Setup**
   The database tables will be created automatically on the first API call. No manual migration needed!

## Database Providers

### Neon (Recommended for Vercel)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` file as `DATABASE_URL`

### Railway
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database
4. Copy the connection string from the database service
5. Add it to your `.env` file as `DATABASE_URL`

## Deployment

### Vercel
1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `DATABASE_URL` (from Neon or Railway)
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL, e.g., `https://your-app.vercel.app`)
4. Deploy!

### Railway
1. Push your code to GitHub
2. Create a new Railway project
3. Add a PostgreSQL database service
4. Add environment variables in the project settings
5. Deploy!

## Testing the Application

1. **Health Check**: Visit `/healthz` - should return `{"ok": true, "version": "1.0", "uptime": ...}`

2. **Create a Link**: 
   - Go to `/`
   - Enter a URL and optionally a custom code
   - Submit the form

3. **Test Redirect**: 
   - Visit `/{code}` where `{code}` is your short code
   - Should redirect to the original URL

4. **View Stats**: 
   - Visit `/code/{code}` to see link statistics

5. **Delete Link**: 
   - Click delete on the dashboard or stats page
   - Try visiting `/{code}` again - should return 404

## API Testing

You can test the API endpoints using curl or Postman:

```bash
# Create a link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "code": "test123"}'

# List all links
curl http://localhost:3000/api/links

# Get link stats
curl http://localhost:3000/api/links/test123

# Delete a link
curl -X DELETE http://localhost:3000/api/links/test123
```

## Troubleshooting

- **Database connection errors**: Make sure your `DATABASE_URL` is correct and the database is accessible
- **Port already in use**: Change the port with `npm run dev -- -p 3001`
- **Build errors**: Make sure all dependencies are installed with `npm install`

