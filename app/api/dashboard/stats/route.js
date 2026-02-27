import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalBookings, pendingBookings, completedBookings, totalServices] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'completed' } }),
      prisma.service.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        completedBookings,
        totalServices,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
