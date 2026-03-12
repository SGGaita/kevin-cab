import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const bookingsResult = await query('SELECT COUNT(*) as count FROM bookings');
    const pendingResult = await query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    const completedResult = await query("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'");
    const driversResult = await query("SELECT COUNT(*) as count FROM users WHERE role = 'driver'");
    
    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: parseInt(bookingsResult.rows[0].count),
        pendingBookings: parseInt(pendingResult.rows[0].count),
        completedBookings: parseInt(completedResult.rows[0].count),
        totalDrivers: parseInt(driversResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
