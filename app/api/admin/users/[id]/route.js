import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Update user (admin only)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, role, phone } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ success: false, error: 'Name, email, and role are required' }, { status: 400 });
    }

    if (!['driver', 'admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
    }

    // Update user
    let updateQuery;
    let updateParams;

    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = 'UPDATE users SET name = $1, email = $2, password = $3, role = $4, phone = $5 WHERE id = $6 RETURNING id, name, email, role, phone';
      updateParams = [name, email, hashedPassword, role, phone || null, id];
    } else {
      updateQuery = 'UPDATE users SET name = $1, email = $2, role = $3, phone = $4 WHERE id = $5 RETURNING id, name, email, role, phone';
      updateParams = [name, email, role, phone || null, id];
    }

    const result = await query(updateQuery, updateParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0],
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Delete user (admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 });
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
