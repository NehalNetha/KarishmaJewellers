import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Get the user making the request from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the requesting user's details
    const { data: requestingUser, error: userError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !requestingUser.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if requesting user is admin or trying to delete their own account
    if (requestingUser.user.user_metadata?.role !== 'ADMIN' && requestingUser.user.email !== email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the target user's details
    const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }
    
    const targetUser = data.users.find(user => user.email === email);
    
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.user_metadata?.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 403 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(targetUser.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  // Method not allowed for security reasons
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}