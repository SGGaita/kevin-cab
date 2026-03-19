import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Password change - Session:', session);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;
    console.log('Password change request for user:', session.user.id);

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Current and new passwords are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Get current user with password
    const userResult = await query(
      'SELECT id, password FROM users WHERE id = $1',
      [session.user.id]
    );
    console.log('User found:', userResult.rows.length > 0);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    console.log('Current password valid:', isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password (remove updated_at if column doesn't exist)
    const updateResult = await query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      [hashedPassword, session.user.id]
    );
    console.log('Password updated:', updateResult.rows.length > 0);

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
