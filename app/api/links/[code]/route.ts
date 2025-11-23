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
  { params }: { params: { code: string } }
) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    const { code } = params;

    const result = await pool.query(
      `SELECT id, code, url, clicks, last_clicked, created_at
       FROM links
       WHERE code = $1 AND deleted = FALSE`,
      [code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

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
    console.error('Error fetching link:', error);
    
    if (error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please check your database connection string.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    const { code } = params;

    const result = await pool.query(
      `UPDATE links
       SET deleted = TRUE
       WHERE code = $1 AND deleted = FALSE
       RETURNING id`,
      [code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting link:', error);
    
    if (error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please check your database connection string.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

