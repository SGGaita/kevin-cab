import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await query(
      'SELECT * FROM whatsapp_templates ORDER BY trigger_event, created_at DESC'
    );

    const templates = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      triggerEvent: row.trigger_event,
      messageTemplate: row.message_template,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, triggerEvent, messageTemplate, isActive } = body;

    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await query(
      `INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, name, triggerEvent, messageTemplate, isActive !== false]
    );

    const template = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      triggerEvent: result.rows[0].trigger_event,
      messageTemplate: result.rows[0].message_template,
      isActive: result.rows[0].is_active,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };

    return NextResponse.json({ success: true, template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ success: false, error: 'Failed to create template' }, { status: 500 });
  }
}
