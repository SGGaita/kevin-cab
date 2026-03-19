import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM contact_info WHERE is_active = true LIMIT 1');
    return NextResponse.json({ success: true, data: result.rows[0] || null });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, address, workingHours, whatsappNumber, headingText, subtitleText, bookingFormHeading, bookingFormSubtitle } = body;

    const workingHoursJson = typeof workingHours === 'object' 
      ? JSON.stringify(workingHours) 
      : workingHours;

    const existing = await query('SELECT id FROM contact_info LIMIT 1');

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE contact_info 
         SET email = $1, phone = $2, address = $3, working_hours = $4, whatsapp_number = $5, 
             heading_text = $6, subtitle_text = $7, booking_form_heading = $8, booking_form_subtitle = $9, updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [email, phone, address, workingHoursJson, whatsappNumber, headingText, subtitleText, bookingFormHeading, bookingFormSubtitle, existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      const id = `contact_${Date.now()}`;
      const result = await query(
        `INSERT INTO contact_info (id, email, phone, address, working_hours, whatsapp_number, heading_text, subtitle_text, booking_form_heading, booking_form_subtitle, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
         RETURNING *`,
        [id, email, phone, address, workingHoursJson, whatsappNumber, headingText, subtitleText, bookingFormHeading, bookingFormSubtitle]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { email, phone, address, workingHours, whatsappNumber, headingText, subtitleText, bookingFormHeading, bookingFormSubtitle } = body;

    const workingHoursJson = typeof workingHours === 'object' 
      ? JSON.stringify(workingHours) 
      : workingHours;

    const existing = await query('SELECT id FROM contact_info LIMIT 1');

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE contact_info 
         SET email = $1, phone = $2, address = $3, working_hours = $4, whatsapp_number = $5,
             heading_text = $6, subtitle_text = $7, booking_form_heading = $8, booking_form_subtitle = $9, updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [email, phone, address, workingHoursJson, whatsappNumber, headingText, subtitleText, bookingFormHeading, bookingFormSubtitle, existing.rows[0].id]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } else {
      return NextResponse.json({ success: false, error: 'No contact info found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
