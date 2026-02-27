import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { siteName, logoUrl, faviconUrl, primaryColor, secondaryColor } = body;

    const existingSettings = await prisma.siteSettings.findFirst();

    let settings;
    if (existingSettings) {
      settings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: { siteName, logoUrl, faviconUrl, primaryColor, secondaryColor },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: { siteName, logoUrl, faviconUrl, primaryColor, secondaryColor },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
