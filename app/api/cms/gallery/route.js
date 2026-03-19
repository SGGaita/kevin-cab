import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM gallery_images WHERE is_active = true ORDER BY "order", created_at ASC');
    return NextResponse.json({ success: true, images: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl, caption, category, order } = body;

    const id = `gallery_${Date.now()}`;
    const result = await query(
      `INSERT INTO gallery_images (id, image_url, caption, category, "order", is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [id, imageUrl, caption || '', category || 'safari', order || 0]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
