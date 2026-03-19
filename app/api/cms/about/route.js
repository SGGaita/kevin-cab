import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM about_sections WHERE is_active = true LIMIT 1');
    return NextResponse.json({ success: true, data: result.rows[0] || null });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, imageUrl, values } = body;

    const existing = await query('SELECT id FROM about_sections LIMIT 1');

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE about_sections 
         SET title = $1, subtitle = $2, description = $3, image_url = $4, stats = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [title, subtitle, description, imageUrl || null, JSON.stringify(values || []), existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      const id = `about_${Date.now()}`;
      const result = await query(
        `INSERT INTO about_sections (id, title, subtitle, description, image_url, stats, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         RETURNING *`,
        [id, title, subtitle, description, imageUrl || null, JSON.stringify(values || [])]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, imageUrl, values } = body;

    const existing = await query('SELECT id FROM about_sections LIMIT 1');

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE about_sections 
         SET title = $1, subtitle = $2, description = $3, image_url = $4, stats = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [title, subtitle, description, imageUrl || null, JSON.stringify(values || []), existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      return NextResponse.json({ success: false, error: 'No about section found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
