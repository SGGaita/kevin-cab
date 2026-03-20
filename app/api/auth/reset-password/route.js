import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, newPassword } = body;

    if (!email || !phone || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, phone number, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const userResult = await query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND phone = $2',
      [email, phone]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email and phone number combination' },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while resetting password' },
      { status: 500 }
    );
  }
}
