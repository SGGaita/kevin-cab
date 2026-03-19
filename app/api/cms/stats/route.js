import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM stats_bar WHERE is_active = true ORDER BY "order", created_at ASC');
    return NextResponse.json({ success: true, stats: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, value, order } = body;

    const id = `stat_${Date.now()}`;
    const result = await query(
      `INSERT INTO stats_bar (id, label, value, "order", is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [id, label, value, order || 0]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
