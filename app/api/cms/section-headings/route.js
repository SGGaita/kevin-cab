import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionKey = searchParams.get('section');

    let result;
    if (sectionKey) {
      result = await query('SELECT * FROM section_headings WHERE section_key = $1', [sectionKey]);
      return NextResponse.json({ success: true, data: result.rows[0] || null });
    } else {
      result = await query('SELECT * FROM section_headings ORDER BY section_key');
      return NextResponse.json({ success: true, sections: result.rows });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sectionKey, overline, heading, description, imageUrl } = body;

    const existing = await query('SELECT id FROM section_headings WHERE section_key = $1', [sectionKey]);

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE section_headings 
         SET overline = $1, heading = $2, description = $3, image_url = $4, updated_at = CURRENT_TIMESTAMP
         WHERE section_key = $5
         RETURNING *`,
        [overline, heading, description, imageUrl, sectionKey]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      const id = `section_${Date.now()}`;
      const result = await query(
        `INSERT INTO section_headings (id, section_key, overline, heading, description, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         RETURNING *`,
        [id, sectionKey, overline, heading, description, imageUrl]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
