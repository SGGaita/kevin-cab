import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, driverId, notes } = body;

    const updateData = {};
    if (status) updateData.status = status;
    if (driverId !== undefined) updateData.driverId = driverId;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
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
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete booking' }, { status: 500 });
  }
}
