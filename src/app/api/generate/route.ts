import Replicate from "replicate";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
    
    // Continue with the existing functionality
    const { imageUrl, prompt = "Generate different style variations of this necklace while keeping its original design intact. Maintain the same structure, shape, and overall look, but explore subtle variations in materials, textures, patterns, and artistic details. Experiment with different metal finishes, gemstone settings, engravings, or cultural influences, but do not alter the core design significantly." } = await req.json();
    
    if (!imageUrl) {
      console.error('No image provided');
      return NextResponse.json({ error: "No image URL or data provided" }, { status: 400 });
    }

    // Validate image input (URL, data URI, etc.)
    if (!isValidUrl(imageUrl) && !imageUrl.startsWith('data:')) {
      console.error('Invalid imageUrl format');
      return NextResponse.json({ error: "Invalid image URL or base64 data" }, { status: 400 });
    }

    console.log('API Token present:', !!process.env.REPLICATE_API_TOKEN);
    
    // Create a prediction using the predictions API
    const input = {
      image: imageUrl,
      prompt,
      num_outputs: 2,
      num_inference_steps: 60,
      scheduler: "DDIM",
      width: 512,
      height: 512,
      guidance_scale: 7.5,
    };
    
    const prediction = await replicate.predictions.create({
      version: "stability-ai/stable-diffusion-3",
      input
    });
    
    console.log('Prediction created:', prediction.id, 'with status:', prediction.status);
    
    // Poll for completion
    let completed;
    const maxAttempts = 15; // Maximum number of polling attempts
    const pollingInterval = 2000; // 2 seconds between polls
    
    for (let i = 0; i < maxAttempts; i++) {
      const latest = await replicate.predictions.get(prediction.id);
      console.log(`Polling attempt ${i+1}/${maxAttempts}, status: ${latest.status}`);
      
      if (latest.status === "succeeded") {
        completed = latest;
        break;
      } else if (latest.status === "failed" || latest.status === "canceled") {
        console.error('Prediction failed or was canceled:', latest);
        return NextResponse.json({ 
          error: "Image generation failed", 
          details: latest.error || "Unknown error" 
        }, { status: 500 });
      }
      
      // Wait before polling again
      if (i < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      }
    }
    
    if (!completed) {
      console.error('Prediction timed out');
      return NextResponse.json({ error: "Image generation timed out" }, { status: 504 });
    }
    
    console.log('Prediction completed with output:', completed.output);
    
    // Validate output
    if (!completed.output || (Array.isArray(completed.output) && completed.output.length === 0)) {
      console.error('Replicate API returned no output');
      return NextResponse.json({ error: "No images generated" }, { status: 500 });
    }

    // Return the result
    return NextResponse.json({ result: completed.output });
  } catch (error) {
    console.error('General error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: "Error generating images",
      details: errorMessage 
    }, { status: 500 });
  }
}