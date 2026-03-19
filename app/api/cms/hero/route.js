import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM hero_sections WHERE is_active = true LIMIT 1');
    const data = result.rows[0];
    
    if (data) {
      return NextResponse.json({ 
        success: true, 
        hero: {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          ctaText: data.cta_text,
          imageUrl: data.image_url,
        }
      });
    }
    
    return NextResponse.json({ success: true, hero: null });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, ctaText, imageUrl } = body;

    // Check if a hero section already exists
    const existing = await query('SELECT id FROM hero_sections LIMIT 1');

    if (existing.rows.length > 0) {
      // Update existing hero section
      const result = await query(
        `UPDATE hero_sections 
         SET title = $1, subtitle = $2, description = $3, cta_text = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [title, subtitle, description, ctaText, imageUrl || null, existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      // Create new hero section
      const id = `hero_${Date.now()}`;
      const result = await query(
        `INSERT INTO hero_sections (id, title, subtitle, description, cta_text, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         RETURNING *`,
        [id, title, subtitle, description, ctaText, imageUrl || null]
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
    const { title, subtitle, description, ctaText, imageUrl } = body;

    const existing = await query('SELECT id FROM hero_sections LIMIT 1');

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE hero_sections 
         SET title = $1, subtitle = $2, description = $3, cta_text = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [title, subtitle, description, ctaText, imageUrl || null, existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      return NextResponse.json({ success: false, error: 'No hero section found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
