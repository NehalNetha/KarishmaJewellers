import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { use } from 'react';

export async function DELETE(
  request: NextRequest,
  {params}: {params: Promise<{ userId: string }>}
) {

  const { userId } = use(params);

  try {
    const supabase = await createClient();
    
    // Check if the requesting user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Delete the user
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}