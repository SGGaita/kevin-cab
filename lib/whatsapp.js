import { query } from './db';

export async function sendWhatsAppMessage(customerPhone, message, bookingId, triggerEvent) {
  try {
    const settingsResult = await query(
      'SELECT * FROM whatsapp_settings WHERE id = $1',
      ['default_settings']
    );

    if (!settingsResult.rows.length) {
      console.log('WhatsApp settings not configured');
      return { success: false, error: 'WhatsApp settings not configured' };
    }

    const settings = settingsResult.rows[0];
    const cleanNumber = customerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await query(
      `INSERT INTO whatsapp_message_log (id, booking_id, customer_phone, message_content, trigger_event, status, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [logId, bookingId, customerPhone, message, triggerEvent, 'sent']
    );

    return {
      success: true,
      whatsappUrl,
      autoSendEnabled: settings.auto_send_enabled,
      message
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
}

export async function getTemplateForEvent(triggerEvent) {
  try {
    const result = await query(
      'SELECT * FROM whatsapp_templates WHERE trigger_event = $1 AND is_active = true LIMIT 1',
      [triggerEvent]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
}

export function replaceTemplatePlaceholders(template, data) {
  let message = template;
  
  const replacements = {
    '{{customerName}}': data.customerName || '',
    '{{customerPhone}}': data.customerPhone || '',
    '{{pickupLocation}}': data.pickupLocation || '',
    '{{destination}}': data.destination || '',
    '{{serviceType}}': data.serviceType || '',
    '{{bookingDate}}': data.bookingDate ? new Date(data.bookingDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '',
    '{{businessPhone}}': data.businessPhone || '',
    '{{driverName}}': data.driverName || '',
    '{{driverPhone}}': data.driverPhone || '',
  };

  Object.keys(replacements).forEach(key => {
    message = message.replace(new RegExp(key, 'g'), replacements[key]);
  });

  return message;
}

export async function prepareBookingNotification(booking, triggerEvent, businessPhone = '') {
  const template = await getTemplateForEvent(triggerEvent);
  
  if (!template) {
    return null;
  }

  const message = replaceTemplatePlaceholders(template.message_template, {
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    pickupLocation: booking.pickupLocation,
    destination: booking.destination,
    serviceType: booking.serviceType,
    bookingDate: booking.bookingDate,
    businessPhone: businessPhone,
    driverName: booking.driverName,
    driverPhone: booking.driverPhone,
  });

  return {
    message,
    templateName: template.name,
  };
}
