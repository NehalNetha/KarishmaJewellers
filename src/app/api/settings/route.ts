// api/settings/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const avatarFile = formData.get('avatar') as File | null;
    let avatar_url = formData.get('avatar_url') as string;

    // Handle avatar upload if a file is provided
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);

      if (uploadError) {
        throw new Error('Failed to upload avatar');
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      avatar_url = publicUrlData.publicUrl;
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      email,
      data: {
        name,
        surname,
        avatar_url
      }
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      avatar_url 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}