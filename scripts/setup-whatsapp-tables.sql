-- Run this script to set up WhatsApp notification tables
-- Execute: psql -U your_username -d your_database -f setup-whatsapp-tables.sql

-- WhatsApp Message Templates table
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Settings table
CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id VARCHAR(255) PRIMARY KEY,
  business_phone VARCHAR(50) NOT NULL,
  api_key VARCHAR(255),
  api_provider VARCHAR(100) DEFAULT 'whatsapp_web',
  auto_send_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Message Log table
CREATE TABLE IF NOT EXISTS whatsapp_message_log (
  id VARCHAR(255) PRIMARY KEY,
  booking_id VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  message_content TEXT NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_event ON whatsapp_templates(trigger_event);
CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_booking ON whatsapp_message_log(booking_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_status ON whatsapp_message_log(status);

-- Insert default templates
INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active) VALUES
('template_confirmed', 'Booking Confirmed', 'booking_confirmed', 
'🎉 *Booking Confirmed!*

Hello {{customerName}},

Your booking has been confirmed! ✅

📋 *Booking Details:*
📍 Pickup: {{pickupLocation}}
🎯 Destination: {{destination}}
🚗 Service: {{serviceType}}
📅 Date: {{bookingDate}}

Our driver will contact you shortly. Thank you for choosing KEVINCAB!

Need help? Call us at {{businessPhone}}', true),

('template_completed', 'Booking Completed', 'booking_completed',
'✅ *Trip Completed*

Hello {{customerName}},

Thank you for riding with KEVINCAB! 🚗

We hope you had a pleasant journey from {{pickupLocation}} to {{destination}}.

⭐ We would love your feedback! Please rate your experience.

Looking forward to serving you again!

📞 Contact: {{businessPhone}}', true),

('template_cancelled', 'Booking Cancelled', 'booking_cancelled',
'❌ *Booking Cancelled*

Hello {{customerName}},

Your booking has been cancelled.

📋 *Cancelled Booking:*
📍 From: {{pickupLocation}}
🎯 To: {{destination}}
📅 Date: {{bookingDate}}

If this was a mistake or you need to rebook, please contact us.

📞 Call: {{businessPhone}}

We hope to serve you soon!', true),

('template_pending', 'Booking Received', 'booking_pending',
'📝 *Booking Received*

Hello {{customerName}},

We have received your booking request! ⏳

📋 *Details:*
📍 Pickup: {{pickupLocation}}
🎯 Destination: {{destination}}
🚗 Service: {{serviceType}}
📅 Date: {{bookingDate}}

We will confirm your booking shortly.

📞 Contact: {{businessPhone}}', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default WhatsApp settings
INSERT INTO whatsapp_settings (id, business_phone, api_provider, auto_send_enabled) VALUES
('default_settings', '254716406998', 'whatsapp_web', false)
ON CONFLICT (id) DO NOTHING;

-- Verify installation
SELECT 'WhatsApp tables created successfully!' as status;
SELECT COUNT(*) as template_count FROM whatsapp_templates;
