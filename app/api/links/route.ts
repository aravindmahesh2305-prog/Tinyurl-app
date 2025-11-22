import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';
import { CreateLinkRequest } from '@/lib/types';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// Generate random code
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  const length = 6;
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Validate code format
function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Validate URL
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    const body: CreateLinkRequest = await request.json();

    const { url, code } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Generate or validate code
    let finalCode = code;
    if (finalCode) {
      if (!isValidCode(finalCode)) {
        return NextResponse.json(
          { success: false, error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
    } else {
      // Generate unique code
      let attempts = 0;
      do {
        finalCode = generateCode();
        const existing = await pool.query(
          'SELECT id FROM links WHERE code = $1 AND deleted = FALSE',
          [finalCode]
        );
        if (existing.rows.length === 0) break;
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { success: false, error: 'Failed to generate unique code' },
            { status: 500 }
          );
        }
      } while (true);
    }

    // Check if code already exists
    const existing = await pool.query(
      'SELECT id FROM links WHERE code = $1 AND deleted = FALSE',
      [finalCode]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Code already exists' },
        { status: 409 }
      );
    }

    // Insert new link
    const result = await pool.query(
      `INSERT INTO links (code, url, clicks, last_clicked, created_at, deleted)
       VALUES ($1, $2, 0, NULL, CURRENT_TIMESTAMP, FALSE)
       RETURNING id, code, url, clicks, last_clicked, created_at`,
      [finalCode, url]
    );

    const link = result.rows[0];
    return NextResponse.json({
      success: true,
      link: {
        id: link.id,
        code: link.code,
        url: link.url,
        clicks: link.clicks,
        lastClicked: link.last_clicked,
        createdAt: link.created_at,
      },
    });
  } catch (error: any) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links - List all links
export async function GET() {
  try {
    await ensureDbInitialized();
    const pool = getPool();

    const result = await pool.query(
      `SELECT id, code, url, clicks, last_clicked, created_at
       FROM links
       WHERE deleted = FALSE
       ORDER BY created_at DESC`
    );

    const links = result.rows.map((row) => ({
      id: row.id,
      code: row.code,
      url: row.url,
      clicks: row.clicks,
      lastClicked: row.last_clicked,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, links });
  } catch (error: any) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

