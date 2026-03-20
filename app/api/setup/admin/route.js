import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password, setupKey } = await request.json();

    // Verify setup key
    if (!process.env.ADMIN_SETUP_KEY) {
      return Response.json(
        { error: 'Admin setup is not configured. Please set ADMIN_SETUP_KEY in environment variables.' },
        { status: 500 }
      );
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return Response.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      );
    }

    // Check if any admin already exists
    const adminCheck = await query(
      'SELECT id FROM users WHERE role = $1 LIMIT 1',
      ['admin']
    );

    if (adminCheck.rows.length > 0) {
      return Response.json(
        { error: 'An admin account already exists. This setup page is disabled.' },
        { status: 403 }
      );
    }

    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return Response.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const result = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashedPassword, name, 'admin']
    );

    return Response.json({
      message: 'Admin account created successfully',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        role: result.rows[0].role
      }
    });

  } catch (error) {
    console.error('Admin setup error:', error);
    return Response.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
