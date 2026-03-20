-- ============================================
-- STEP 4: DEFAULT DATA (WhatsApp Templates)
-- ============================================

-- Insert default WhatsApp templates
INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active) VALUES
('template_confirmed', 'Booking Confirmed', 'booking_confirmed', 
'*Booking Confirmed!*

Hello {{customerName}},

Your booking has been confirmed!

*Booking Details:*
Pickup: {{pickupLocation}}
Destination: {{destination}}
Service: {{serviceType}}
Date: {{bookingDate}}

Our driver will contact you shortly. Thank you for choosing KEVINCAB!

Need help? Call us at {{businessPhone}}', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active) VALUES
('template_completed', 'Booking Completed', 'booking_completed',
'*Trip Completed*

Hello {{customerName}},

Thank you for riding with KEVINCAB!

We hope you had a pleasant journey from {{pickupLocation}} to {{destination}}.

We would love your feedback! Please rate your experience.

Looking forward to serving you again!

Contact: {{businessPhone}}', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active) VALUES
('template_cancelled', 'Booking Cancelled', 'booking_cancelled',
'*Booking Cancelled*

Hello {{customerName}},

Your booking has been cancelled.

*Cancelled Booking:*
From: {{pickupLocation}}
To: {{destination}}
Date: {{bookingDate}}

If this was a mistake or you need to rebook, please contact us.

Call: {{businessPhone}}

We hope to serve you soon!', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active) VALUES
('template_pending', 'Booking Received', 'booking_pending',
'*Booking Received*

Hello {{customerName}},

We have received your booking request!

*Details:*
Pickup: {{pickupLocation}}
Destination: {{destination}}
Service: {{serviceType}}
Date: {{bookingDate}}

We will confirm your booking shortly.

Contact: {{businessPhone}}', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default WhatsApp settings
INSERT INTO whatsapp_settings (id, business_phone, api_provider, auto_send_enabled) VALUES
('default_settings', '254716406998', 'whatsapp_web', false)
ON CONFLICT (id) DO NOTHING;
