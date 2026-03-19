import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM social_media ORDER BY "order", created_at DESC');
    return NextResponse.json({ success: true, socialLinks: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, url } = body;

    const id = `social_${Date.now()}`;
    const result = await query(
      `INSERT INTO social_media (id, platform, url, is_active, "order")
       VALUES ($1, $2, $3, true, 0)
       RETURNING *`,
      [id, platform, url]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
