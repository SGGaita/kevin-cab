import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await query(
      'SELECT * FROM whatsapp_settings WHERE id = $1',
      ['default_settings']
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: true, 
        settings: {
          businessPhone: '',
          apiProvider: 'whatsapp_web',
          autoSendEnabled: false
        }
      });
    }

    const settings = {
      id: result.rows[0].id,
      businessPhone: result.rows[0].business_phone,
      apiKey: result.rows[0].api_key ? '***hidden***' : '',
      apiProvider: result.rows[0].api_provider,
      autoSendEnabled: result.rows[0].auto_send_enabled,
    };

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { businessPhone, apiKey, apiProvider, autoSendEnabled } = body;

    const checkResult = await query(
      'SELECT * FROM whatsapp_settings WHERE id = $1',
      ['default_settings']
    );

    let result;
    if (checkResult.rows.length === 0) {
      result = await query(
        `INSERT INTO whatsapp_settings (id, business_phone, api_key, api_provider, auto_send_enabled, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        ['default_settings', businessPhone, apiKey, apiProvider, autoSendEnabled]
      );
    } else {
      const updateFields = [];
      const params = [];
      let paramCount = 1;

      if (businessPhone !== undefined) {
        updateFields.push(`business_phone = $${paramCount}`);
        params.push(businessPhone);
        paramCount++;
      }
      if (apiKey !== undefined && apiKey !== '***hidden***') {
        updateFields.push(`api_key = $${paramCount}`);
        params.push(apiKey);
        paramCount++;
      }
      if (apiProvider !== undefined) {
        updateFields.push(`api_provider = $${paramCount}`);
        params.push(apiProvider);
        paramCount++;
      }
      if (autoSendEnabled !== undefined) {
        updateFields.push(`auto_send_enabled = $${paramCount}`);
        params.push(autoSendEnabled);
        paramCount++;
      }

      updateFields.push('updated_at = NOW()');
      params.push('default_settings');

      result = await query(
        `UPDATE whatsapp_settings SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        params
      );
    }

    const settings = {
      id: result.rows[0].id,
      businessPhone: result.rows[0].business_phone,
      apiKey: result.rows[0].api_key ? '***hidden***' : '',
      apiProvider: result.rows[0].api_provider,
      autoSendEnabled: result.rows[0].auto_send_enabled,
    };

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
