import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { platform, url } = body;

    const socialLink = await prisma.socialMedia.update({
      where: { id },
      data: {
        platform,
        url,
      },
    });

    return NextResponse.json({ success: true, socialLink });
  } catch (error) {
    console.error('Error updating social link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update social link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.socialMedia.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete social link' },
      { status: 500 }
    );
  }
}
