import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import sharp from "sharp"; // We'll need to install this package

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    console.log('Starting API request processing...');
    
    // Authenticate the user using the existing Supabase server client
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Unauthorized: No valid session');
      return NextResponse.json({ error: 'Unauthorized: Please log in to use this feature' }, { status: 401 });
    }
    
    console.log('Authenticated user:', session.user.email);
    
    // Get the image data from the request
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      console.error('No image provided');
      return NextResponse.json({ error: "No image URL or data provided" }, { status: 400 });
    }

    // Validate image input (URL, data URI, etc.)
    if (!isValidUrl(imageUrl) && !imageUrl.startsWith('data:')) {
      console.error('Invalid imageUrl format');
      return NextResponse.json({ error: "Invalid image URL or base64 data" }, { status: 400 });
    }

    // Fetch the image data
    let imageBuffer: Buffer;
    if (imageUrl.startsWith('data:')) {
      // Handle base64 data URI
      const base64Data = imageUrl.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // Handle URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    // Resize the image to comply with ClipDrop's maximum dimensions
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: 1024,
        height: 1024,
        fit: 'inside', // Maintain aspect ratio
        withoutEnlargement: true // Don't enlarge if smaller than these dimensions
      })
      .toBuffer();

    // Create form data for ClipDrop API
    const formData = new FormData();
    
    // Create a Blob with the correct MIME type
    const mimeType = imageUrl.startsWith('data:') 
      ? imageUrl.split(';')[0].split(':')[1] 
      : 'image/jpeg';
    
    const blob = new Blob([resizedImageBuffer], { type: mimeType });
    
    // Add the file to the form data with the correct name expected by ClipDrop API
    formData.append('image_file', blob, 'image.jpg');

    console.log('Calling ClipDrop API...');
    console.log('API Key present:', !!process.env.CLIPDROP_API_KEY);
    
    // Call ClipDrop API
    const clipDropResponse = await fetch('https://clipdrop-api.co/reimagine/v1/reimagine', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY || '',
      },
      body: formData
    });

    if (!clipDropResponse.ok) {
      const errorText = await clipDropResponse.text();
      console.error('ClipDrop API error:', clipDropResponse.status, clipDropResponse.statusText, errorText);
      return NextResponse.json({ 
        error: "Image reimagining failed", 
        details: `${clipDropResponse.statusText}: ${errorText}` 
      }, { status: clipDropResponse.status });
    }

    // Get the image data from the response
    const reimaginedImageData = await clipDropResponse.arrayBuffer();
    
    // Convert to base64 for returning to the client
    const base64Image = Buffer.from(reimaginedImageData).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log('Image reimagining completed successfully');
    
    // Return the result
    return NextResponse.json({ 
      result: dataUrl,
      success: true
    });
  } catch (error) {
    console.error('General error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: "Error reimagining image",
      details: errorMessage 
    }, { status: 500 });
  }
}