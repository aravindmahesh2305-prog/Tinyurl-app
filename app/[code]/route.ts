import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// GET /:code - Redirect to original URL
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } }
) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    
    // Handle params - Next.js 14 uses object, Next.js 15+ uses Promise
    let code: string;
    if (params instanceof Promise) {
      const resolvedParams = await params;
      code = resolvedParams.code;
    } else {
      code = params.code;
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // First, get the link to verify it exists
    const checkResult = await pool.query(
      `SELECT url FROM links WHERE code = $1 AND deleted = FALSE`,
      [code]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const url = checkResult.rows[0].url;

    // Update click stats - use a separate query to ensure it completes
    // We do this after getting the URL so we can still redirect even if update fails
    try {
      const updateResult = await pool.query(
        `UPDATE links
         SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP
         WHERE code = $1 AND deleted = FALSE`,
        [code]
      );
      console.log(`Updated clicks for code: ${code}, rows affected: ${updateResult.rowCount}`);
    } catch (updateError: any) {
      // Log the error but still allow redirect
      console.error('Error updating click count:', updateError);
    }
    
    // Redirect to the original URL
    return NextResponse.redirect(url, { status: 302 });
  } catch (error: any) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

