const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupWhatsAppTables() {
  const client = await pool.connect();
  
  try {
    console.log('Starting WhatsApp tables migration...\n');
    
    // Create whatsapp_templates table
    console.log('Creating whatsapp_templates table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_templates (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        trigger_event VARCHAR(100) NOT NULL,
        message_template TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ whatsapp_templates table created');
    
    // Create whatsapp_settings table
    console.log('Creating whatsapp_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_settings (
        id VARCHAR(255) PRIMARY KEY,
        business_phone VARCHAR(50) NOT NULL,
        api_key VARCHAR(255),
        api_provider VARCHAR(100) DEFAULT 'whatsapp_web',
        auto_send_enabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ whatsapp_settings table created');
    
    // Create whatsapp_message_log table
    console.log('Creating whatsapp_message_log table...');
    await client.query(`
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
    `);
    console.log('✓ whatsapp_message_log table created');
    
    // Create indexes
    console.log('\nCreating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_event 
      ON whatsapp_templates(trigger_event);
    `);
    console.log('✓ Index on whatsapp_templates.trigger_event created');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_booking 
      ON whatsapp_message_log(booking_id);
    `);
    console.log('✓ Index on whatsapp_message_log.booking_id created');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_status 
      ON whatsapp_message_log(status);
    `);
    console.log('✓ Index on whatsapp_message_log.status created');
    
    // Insert default templates
    console.log('\nInserting default templates...');
    
    const templates = [
      {
        id: 'template_confirmed',
        name: 'Booking Confirmed',
        trigger_event: 'booking_confirmed',
        message_template: `🎉 *Booking Confirmed!*

Hello {{customerName}},

Your booking has been confirmed! ✅

📋 *Booking Details:*
📍 Pickup: {{pickupLocation}}
🎯 Destination: {{destination}}
🚗 Service: {{serviceType}}
📅 Date: {{bookingDate}}

Our driver will contact you shortly. Thank you for choosing KEVINCAB!

Need help? Call us at {{businessPhone}}`
      },
      {
        id: 'template_completed',
        name: 'Booking Completed',
        trigger_event: 'booking_completed',
        message_template: `✅ *Trip Completed*

Hello {{customerName}},

Thank you for riding with KEVINCAB! 🚗

We hope you had a pleasant journey from {{pickupLocation}} to {{destination}}.

⭐ We would love your feedback! Please rate your experience.

Looking forward to serving you again!

📞 Contact: {{businessPhone}}`
      },
      {
        id: 'template_cancelled',
        name: 'Booking Cancelled',
        trigger_event: 'booking_cancelled',
        message_template: `❌ *Booking Cancelled*

Hello {{customerName}},

Your booking has been cancelled.

📋 *Cancelled Booking:*
📍 From: {{pickupLocation}}
🎯 To: {{destination}}
📅 Date: {{bookingDate}}

If this was a mistake or you need to rebook, please contact us.

📞 Call: {{businessPhone}}

We hope to serve you soon!`
      },
      {
        id: 'template_pending',
        name: 'Booking Received',
        trigger_event: 'booking_pending',
        message_template: `📝 *Booking Received*

Hello {{customerName}},

We have received your booking request! ⏳

📋 *Details:*
📍 Pickup: {{pickupLocation}}
🎯 Destination: {{destination}}
🚗 Service: {{serviceType}}
📅 Date: {{bookingDate}}

We will confirm your booking shortly.

📞 Contact: {{businessPhone}}`
      }
    ];
    
    for (const template of templates) {
      await client.query(`
        INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active)
        VALUES ($1, $2, $3, $4, true)
        ON CONFLICT (id) DO NOTHING;
      `, [template.id, template.name, template.trigger_event, template.message_template]);
      console.log(`✓ Template "${template.name}" inserted`);
    }
    
    // Insert default settings
    console.log('\nInserting default WhatsApp settings...');
    await client.query(`
      INSERT INTO whatsapp_settings (id, business_phone, api_provider, auto_send_enabled)
      VALUES ('default_settings', '254716406998', 'whatsapp_web', false)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✓ Default settings inserted');
    
    // Verify installation
    console.log('\nVerifying installation...');
    const templateCount = await client.query('SELECT COUNT(*) as count FROM whatsapp_templates');
    console.log(`✓ Total templates: ${templateCount.rows[0].count}`);
    
    const settingsCount = await client.query('SELECT COUNT(*) as count FROM whatsapp_settings');
    console.log(`✓ Total settings: ${settingsCount.rows[0].count}`);
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupWhatsAppTables()
  .then(() => {
    console.log('\n✓ WhatsApp tables migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  });
