import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, pickupLocation, destination, serviceType, bookingDate } = body;

    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await query(
      `INSERT INTO bookings (id, customer_name, customer_phone, pickup_location, destination, service_type, booking_date, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [id, customerName, customerPhone, pickupLocation, destination, serviceType, new Date(bookingDate), 'pending']
    );

    return NextResponse.json({ success: true, booking: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const driverId = searchParams.get('driverId');

    let sql = `
      SELECT b.*, u.id as driver_id, u.name as driver_name, u.email as driver_email, u.phone as driver_phone
      FROM bookings b
      LEFT JOIN users u ON b.driver_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      sql += ` AND b.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    if (driverId) {
      sql += ` AND b.driver_id = $${paramCount}`;
      params.push(driverId);
      paramCount++;
    }

    sql += ' ORDER BY b.created_at DESC';

    const result = await query(sql, params);
    
    const bookings = result.rows.map(row => ({
      ...row,
      driver: row.driver_id ? {
        id: row.driver_id,
        name: row.driver_name,
        email: row.driver_email,
        phone: row.driver_phone
      } : null
    }));

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

