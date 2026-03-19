import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { prepareBookingNotification, sendWhatsAppMessage } from '@/lib/whatsapp';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, driverId, notes } = body;
    
    const oldBookingResult = await query('SELECT * FROM bookings WHERE id = $1', [id]);
    const oldStatus = oldBookingResult.rows[0]?.status;
    
    const result = await query(
      'UPDATE bookings SET status = COALESCE($1, status), driver_id = COALESCE($2, driver_id), notes = COALESCE($3, notes), updated_at = NOW() WHERE id = $4 RETURNING *',
      [status, driverId, notes, id]
    );
    
    const updatedBooking = result.rows[0];
    let whatsappResponse = null;

    if (status && status !== oldStatus) {
      const settingsResult = await query(
        'SELECT business_phone FROM whatsapp_settings WHERE id = $1',
        ['default_settings']
      );
      const businessPhone = settingsResult.rows[0]?.business_phone || '';

      const triggerEventMap = {
        'confirmed': 'booking_confirmed',
        'completed': 'booking_completed',
        'cancelled': 'booking_cancelled',
        'pending': 'booking_pending'
      };

      const triggerEvent = triggerEventMap[status];
      
      if (triggerEvent) {
        const notification = await prepareBookingNotification(
          {
            customerName: updatedBooking.customer_name,
            customerPhone: updatedBooking.customer_phone,
            pickupLocation: updatedBooking.pickup_location,
            destination: updatedBooking.destination,
            serviceType: updatedBooking.service_type,
            bookingDate: updatedBooking.booking_date,
          },
          triggerEvent,
          businessPhone
        );

        if (notification) {
          whatsappResponse = await sendWhatsAppMessage(
            updatedBooking.customer_phone,
            notification.message,
            updatedBooking.id,
            triggerEvent
          );
        }
      }
    }

    const bookingResponse = {
      id: updatedBooking.id,
      customerName: updatedBooking.customer_name,
      customerPhone: updatedBooking.customer_phone,
      pickupLocation: updatedBooking.pickup_location,
      destination: updatedBooking.destination,
      serviceType: updatedBooking.service_type,
      bookingDate: updatedBooking.booking_date,
      status: updatedBooking.status,
      notes: updatedBooking.notes,
      driverId: updatedBooking.driver_id,
    };
    
    return NextResponse.json({ 
      success: true, 
      booking: bookingResponse,
      whatsapp: whatsappResponse 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
