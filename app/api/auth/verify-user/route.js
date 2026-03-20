import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    if (!email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Email and phone number are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT id, email, name FROM users WHERE LOWER(email) = LOWER($1) AND phone = $2',
      [email, phone]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email and phone number combination' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
