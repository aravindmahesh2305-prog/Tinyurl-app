import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';
import { CreateLinkRequest } from '@/lib/types';

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  const length = 6;
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function normalizeUrl(url: string): string {
  return url.trim();
}

function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    const body: CreateLinkRequest = await request.json();

    const { url, code } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);

    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const existingUrl = await pool.query(
      'SELECT id, code, url, clicks, last_clicked, created_at FROM links WHERE url = $1 AND deleted = FALSE ORDER BY created_at ASC LIMIT 1',
      [normalizedUrl]
    );

    if (existingUrl.rows.length > 0) {
      const link = existingUrl.rows[0];
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
    }

    let finalCode = code;
    if (finalCode) {
      finalCode = finalCode.trim();
      if (!isValidCode(finalCode)) {
        return NextResponse.json(
          { success: false, error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
    } else {
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

    const result = await pool.query(
      `INSERT INTO links (code, url, clicks, last_clicked, created_at, deleted)
       VALUES ($1, $2, 0, NULL, CURRENT_TIMESTAMP, FALSE)
       RETURNING id, code, url, clicks, last_clicked, created_at`,
      [finalCode, normalizedUrl]
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

