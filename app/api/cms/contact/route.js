import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contact = await prisma.contactInfo.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, address, workingHours } = body;

    const existingContact = await prisma.contactInfo.findFirst({
      where: { isActive: true },
    });

    let contact;
    if (existingContact) {
      contact = await prisma.contactInfo.update({
        where: { id: existingContact.id },
        data: { email, phone, address, workingHours },
      });
    } else {
      contact = await prisma.contactInfo.create({
        data: { email, phone, address, workingHours, isActive: true },
      });
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}
