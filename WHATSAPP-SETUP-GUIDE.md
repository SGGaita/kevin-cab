# WhatsApp Notification System - Setup Guide

## Overview

The WhatsApp notification system automatically sends messages to customers when their booking status changes. This guide explains how it works and how to set it up.

## Features

✅ **Automated Notifications** - Send WhatsApp messages when bookings are confirmed, completed, or cancelled
✅ **Template Management** - Create and customize message templates with placeholders
✅ **Message Preview** - Preview messages before saving templates
✅ **Message Logging** - Track all sent messages in the database
✅ **Flexible Sending** - Support for WhatsApp Web (manual) or API integration (automatic)

## Database Setup

### 1. Run the SQL Migration

Execute the SQL script to create the required tables:

```bash
# Using psql
psql -U your_username -d your_database -f scripts/setup-whatsapp-tables.sql

# Or using your database client
# Run the contents of: database/whatsapp-templates-schema.sql
```

This creates three tables:
- `whatsapp_templates` - Message templates for different events
- `whatsapp_settings` - WhatsApp configuration
- `whatsapp_message_log` - Log of all sent messages

### 2. Verify Installation

Check that the tables were created and default templates were inserted:

```sql
SELECT * FROM whatsapp_templates;
SELECT * FROM whatsapp_settings;
```

## Configuration

### 1. Access WhatsApp Templates Page

Navigate to: `http://localhost:3000/dashboard/whatsapp-templates`

You'll find this in the sidebar menu under "WhatsApp Templates" (visible to both drivers and admins).

### 2. Configure Settings

Click on the **Settings** tab and configure:

- **Business Phone Number**: Your WhatsApp business number (include country code, e.g., 254716406998)
- **API Provider**: Choose how messages are sent
  - `WhatsApp Web` - Opens WhatsApp Web with pre-filled message (requires manual send)
  - `Twilio API` - Automatically sends via Twilio (requires API credentials)
  - `WhatsApp Business API` - Uses official WhatsApp Business API
- **Auto-send Enabled**: Toggle automatic sending (only works with API integration)

### 3. Customize Message Templates

The system comes with 4 default templates:

1. **Booking Received (Pending)** - Sent when a new booking is created
2. **Booking Confirmed** - Sent when booking status changes to "confirmed"
3. **Booking Completed** - Sent when booking status changes to "completed"
4. **Booking Cancelled** - Sent when booking status changes to "cancelled"

#### Available Placeholders

Use these placeholders in your templates:

- `{{customerName}}` - Customer's name
- `{{customerPhone}}` - Customer's phone number
- `{{pickupLocation}}` - Pickup location
- `{{destination}}` - Destination
- `{{serviceType}}` - Service type (e.g., Airport Transfer)
- `{{bookingDate}}` - Booking date and time
- `{{businessPhone}}` - Your business phone number
- `{{driverName}}` - Assigned driver's name
- `{{driverPhone}}` - Assigned driver's phone

#### Editing Templates

1. Click **Edit** on any template card
2. Modify the template name, trigger event, or message content
3. Click placeholders to insert them into your message
4. Use **Preview Message** to see how it will look with sample data
5. Toggle **Active** to enable/disable the template
6. Click **Save Template**

## How It Works

### Booking Status Change Flow

1. **Driver updates booking status** in `/dashboard/bookings`
2. **Backend detects status change** in the booking API
3. **System finds matching template** based on the new status
4. **Placeholders are replaced** with actual booking data
5. **Message is prepared** and logged in the database
6. **WhatsApp action is triggered**:
   - **WhatsApp Web mode**: Opens new tab with pre-filled message
   - **API mode**: Automatically sends the message

### Example Flow

```
Booking Status: pending → confirmed
↓
System finds template: "booking_confirmed"
↓
Replaces placeholders with booking data
↓
Message logged in whatsapp_message_log
↓
WhatsApp Web opens with message (or API sends automatically)
```

## Usage in Bookings Page

When you update a booking status at `http://localhost:3000/dashboard/bookings`:

1. Click **Edit** on any booking
2. Change the **Status** dropdown
3. Click **Update Booking**
4. If a template exists for that status:
   - WhatsApp Web will open in a new tab with the pre-filled message
   - You'll see a success notification
   - The message is logged in the database

## Message Log

All sent messages are tracked in the `whatsapp_message_log` table:

```sql
SELECT * FROM whatsapp_message_log 
WHERE booking_id = 'your_booking_id'
ORDER BY sent_at DESC;
```

## API Integration (Advanced)

### Using Twilio

1. Sign up for Twilio account
2. Get your Account SID and Auth Token
3. Enable WhatsApp on your Twilio number
4. Update settings:
   - API Provider: `Twilio API`
   - API Key: Your Twilio Auth Token
   - Auto-send Enabled: `true`

### Using WhatsApp Business API

1. Apply for WhatsApp Business API access
2. Get your API credentials
3. Update settings accordingly
4. Implement the API integration in `lib/whatsapp.js`

## Troubleshooting

### Messages not sending

1. Check that the template is **Active**
2. Verify the **Business Phone Number** is correct
3. Check the browser console for errors
4. Verify database tables exist

### Template not found

1. Ensure template exists for the status change
2. Check `trigger_event` matches the status
3. Verify template is marked as active

### WhatsApp Web not opening

1. Check browser popup blocker settings
2. Verify customer phone number format
3. Check browser console for errors

## File Structure

```
app/
├── api/
│   ├── bookings/[id]/route.js      # Updated to send notifications
│   └── whatsapp/
│       ├── templates/route.js       # Template CRUD
│       ├── templates/[id]/route.js  # Template update/delete
│       └── settings/route.js        # WhatsApp settings
├── dashboard/
│   ├── bookings/page.js            # Updated to handle notifications
│   └── whatsapp-templates/page.js  # Template management UI
lib/
└── whatsapp.js                     # WhatsApp utility functions
database/
└── whatsapp-templates-schema.sql   # Database schema
```

## Security Notes

- API keys are hidden in the UI (shown as `***hidden***`)
- Message logs include customer phone numbers - ensure compliance with privacy laws
- Consider implementing rate limiting for API-based sending
- Validate phone numbers before sending

## Next Steps

1. ✅ Run database migration
2. ✅ Configure WhatsApp settings
3. ✅ Customize message templates
4. ✅ Test with a booking status change
5. 🔄 (Optional) Set up API integration for auto-sending

## Support

For issues or questions, check:
- Database connection in `lib/db.js`
- API endpoints in `app/api/whatsapp/`
- Frontend components in `app/dashboard/whatsapp-templates/`
