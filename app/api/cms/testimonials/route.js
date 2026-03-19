import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM testimonials WHERE is_active = true ORDER BY "order", created_at ASC');
    return NextResponse.json({ success: true, testimonials: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, role, rating, text, avatarUrl, order } = body;

    const id = `testimonial_${Date.now()}`;
    const result = await query(
      `INSERT INTO testimonials (id, name, role, rating, text, avatar_url, "order", is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING *`,
      [id, name, role || '', rating || 5, text, avatarUrl || null, order || 0]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
