import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, hero });
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, ctaText, imageUrl } = body;

    const existingHero = await prisma.heroSection.findFirst({
      where: { isActive: true },
    });

    let hero;
    if (existingHero) {
      hero = await prisma.heroSection.update({
        where: { id: existingHero.id },
        data: { title, subtitle, description, ctaText, imageUrl },
      });
    } else {
      hero = await prisma.heroSection.create({
        data: { title, subtitle, description, ctaText, imageUrl, isActive: true },
      });
    }

    return NextResponse.json({ success: true, hero });
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}
