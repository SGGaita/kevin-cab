import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Fetching user data - Session:', session);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch fresh user data from database
    const result = await query(
      'SELECT id, name, email, role, phone, first_login FROM users WHERE id = $1',
      [session.user.id]
    );
    console.log('User data from DB:', result.rows[0]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      role: result.rows[0].role,
      phone: result.rows[0].phone,
      firstLogin: result.rows[0].first_login || false,
    };

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
