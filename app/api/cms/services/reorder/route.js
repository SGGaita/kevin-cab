import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { services } = body;

    if (!services || !Array.isArray(services)) {
      return NextResponse.json({ success: false, error: 'Invalid services data' }, { status: 400 });
    }

    // Update each service's display_order
    for (const service of services) {
      await query(
        'UPDATE services SET display_order = $1 WHERE id = $2',
        [service.displayOrder, service.id]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service order updated successfully',
    });
  } catch (error) {
    console.error('Error reordering services:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
