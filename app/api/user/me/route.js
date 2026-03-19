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
      'SELECT id, name, email, role, phone FROM users WHERE id = $1',
      [session.user.id]
    );
    console.log('User data from DB:', result.rows[0]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
