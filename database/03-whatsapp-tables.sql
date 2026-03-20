-- ============================================
-- STEP 3: WHATSAPP INTEGRATION TABLES
-- ============================================

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
