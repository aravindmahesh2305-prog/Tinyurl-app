import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } }
) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    
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

    await pool.query(
      `UPDATE links
       SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP
       WHERE code = $1 AND deleted = FALSE`,
      [code]
    );
    
    return NextResponse.redirect(url, { status: 302 });
  } catch (error: any) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

