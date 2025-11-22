# TinyLink - URL Shortener

A modern URL shortener application built with Next.js, TypeScript, and PostgreSQL.

## Features

- ✅ Create short links with optional custom codes
- ✅ Redirect with HTTP 302 and track clicks
- ✅ View statistics for each link
- ✅ Delete links (returns 404 after deletion)
- ✅ Dashboard with sortable/filterable table
- ✅ Responsive design with clean UI
- ✅ Health check endpoint

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (compatible with Neon, Railway, etc.)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Neon, Railway, etc.)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tinylink
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following:
```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the `DATABASE_URL` with your actual database connection string (from Neon, Railway, etc.).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application will automatically create the required tables on first run. The schema includes:

- `links` table with columns: id, code, url, clicks, last_clicked, created_at, deleted

## API Endpoints

### POST /api/links
Create a new short link.

**Request:**
```json
{
  "url": "https://example.com",
  "code": "optional" // 6-8 alphanumeric characters
}
```

**Response:**
```json
{
  "success": true,
  "link": {
    "id": 1,
    "code": "abc123",
    "url": "https://example.com",
    "clicks": 0,
    "lastClicked": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/links
List all links.

**Response:**
```json
{
  "success": true,
  "links": [...]
}
```

### GET /api/links/:code
Get statistics for a specific link.

### DELETE /api/links/:code
Delete a link (soft delete).

### GET /healthz
Health check endpoint.

**Response:**
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 12345
}
```

## Routes

- `/` - Dashboard (list all links, create new links)
- `/code/:code` - Statistics page for a specific link
- `/:code` - Redirect to original URL (HTTP 302)
- `/healthz` - Health check

## Deployment

### Vercel + Neon

1. Push your code to GitHub
2. Create a Neon database and get the connection string
3. Deploy to Vercel:
   - Import your GitHub repository
   - Add `DATABASE_URL` environment variable
   - Add `NEXT_PUBLIC_APP_URL` with your Vercel URL
4. Deploy!

### Railway

1. Push your code to GitHub
2. Create a new Railway project
3. Add a PostgreSQL database
4. Set environment variables in Railway dashboard
5. Deploy!

## Code Validation

- Custom codes must match regex: `[A-Za-z0-9]{6,8}`
- URLs are validated before saving
- Duplicate codes return HTTP 409
- Deleted links return HTTP 404

## License

MIT

