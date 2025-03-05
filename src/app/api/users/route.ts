import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'USER',
      created_at: user.created_at,
      // Add metadata fields
      name: user.user_metadata?.name,
      surname: user.user_metadata?.surname,
      avatar_url: user.user_metadata?.avatar_url,
      user_metadata: user.user_metadata  // Include full metadata
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}