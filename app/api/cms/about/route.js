import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const about = await prisma.aboutSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, about });
  } catch (error) {
    console.error('Error fetching about section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about section' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, imageUrl } = body;

    const existingAbout = await prisma.aboutSection.findFirst({
      where: { isActive: true },
    });

    let about;
    if (existingAbout) {
      about = await prisma.aboutSection.update({
        where: { id: existingAbout.id },
        data: { title, subtitle, description, imageUrl },
      });
    } else {
      about = await prisma.aboutSection.create({
        data: { title, subtitle, description, imageUrl, isActive: true },
      });
    }

    return NextResponse.json({ success: true, about });
  } catch (error) {
    console.error('Error updating about section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update about section' },
      { status: 500 }
    );
  }
}
