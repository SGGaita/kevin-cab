import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, driverId } = body;
    
    const result = await query(
      'UPDATE bookings SET status = COALESCE($1, status), driver_id = COALESCE($2, driver_id), updated_at = NOW() WHERE id = $3 RETURNING *',
      [status, driverId, id]
    );
    
    return NextResponse.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
