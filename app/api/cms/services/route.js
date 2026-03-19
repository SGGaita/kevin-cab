import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM services ORDER BY display_order ASC, created_at DESC');
    return NextResponse.json({ success: true, services: result.rows });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, icon, price, displayOrder } = body;

    const id = `service_${Date.now()}`;
    const result = await query(
      `INSERT INTO services (id, title, description, icon, price, is_active, display_order)
       VALUES ($1, $2, $3, $4, $5, true, $6)
       RETURNING *`,
      [id, title, description, icon, price || null, displayOrder || 0]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
