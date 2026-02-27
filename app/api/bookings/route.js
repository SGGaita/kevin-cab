import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, pickupLocation, destination, serviceType, bookingDate } = body;

    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerPhone,
        pickupLocation,
        destination,
        serviceType,
        bookingDate: new Date(bookingDate),
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
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

    const where = {};
    if (status) where.status = status;
    if (driverId) where.driverId = driverId;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
