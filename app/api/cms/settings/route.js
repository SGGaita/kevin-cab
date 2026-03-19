import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM site_settings LIMIT 1');
    return NextResponse.json({ success: true, data: result.rows[0] || null });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { siteName, logoUrl, faviconUrl, primaryColor, secondaryColor, footerDescription, copyrightText } = body;

    const existing = await query('SELECT id FROM site_settings LIMIT 1');

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE site_settings 
         SET site_name = $1, logo_url = $2, favicon_url = $3, primary_color = $4, 
             secondary_color = $5, footer_description = $6, copyright_text = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [siteName, logoUrl, faviconUrl, primaryColor, secondaryColor, footerDescription, copyrightText, existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      const id = `settings_${Date.now()}`;
      const result = await query(
        `INSERT INTO site_settings (id, site_name, logo_url, favicon_url, primary_color, secondary_color, footer_description, copyright_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [id, siteName, logoUrl, faviconUrl, primaryColor, secondaryColor, footerDescription, copyrightText]
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
    const { siteName, logoUrl, faviconUrl, primaryColor, secondaryColor, footerDescription, copyrightText } = body;

    const existing = await query('SELECT id FROM site_settings LIMIT 1');

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE site_settings 
         SET site_name = $1, logo_url = $2, favicon_url = $3, primary_color = $4,
             secondary_color = $5, footer_description = $6, copyright_text = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [siteName, logoUrl, faviconUrl, primaryColor, secondaryColor, footerDescription, copyrightText, existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      return NextResponse.json({ success: false, error: 'No settings found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
