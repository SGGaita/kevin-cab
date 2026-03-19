import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { platform, url } = body;

    const result = await query(
      `UPDATE social_media 
       SET platform = $1, url = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [platform, url, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Social link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const result = await query(
      'DELETE FROM social_media WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Social link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Social link deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
