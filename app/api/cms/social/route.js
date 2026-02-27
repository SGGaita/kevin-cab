import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const socialLinks = await prisma.socialMedia.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, socialLinks });
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social links' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, url } = body;

    const socialLink = await prisma.socialMedia.create({
      data: {
        platform,
        url,
        isActive: true,
        order: 0,
      },
    });

    return NextResponse.json({ success: true, socialLink });
  } catch (error) {
    console.error('Error creating social link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create social link' },
      { status: 500 }
    );
  }
}
