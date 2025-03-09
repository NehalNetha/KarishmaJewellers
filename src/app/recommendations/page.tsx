"use client"
import React, { useState, useRef } from 'react'
import Recommendation from '../(components)/Recommendation'

type Props = {}

const page = (props: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadRecommendations = () => {
    // Download all generated images
    if (generatedImages.length > 0) {
      generatedImages.forEach((imageUrl, index) => {
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `jewelry-design-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Reset generated images when a new image is uploaded
      setGeneratedImages([]);
    }
  };

  const handleUploadButtonClick = async () => {
    if (selectedImage) {
      // If image is already selected, this becomes a "Generate" button
      await generateRecommendations();
    } else {
      // If no image is selected, open the file dialog
      fileInputRef.current?.click();
    }
  };

  const generateRecommendations = async () => {
    if (!selectedImage) return;
    
    try {
      setIsGenerating(true);
      
      // Convert the File to a base64 string
      const base64Image = await fileToBase64(selectedImage);
      
      // Call the API to generate images
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: base64Image,
          prompt: "Generate different jewelry style variations of this image"
        }),
      });

      
      const data = await response.json();

      console.log("replicate data response: ", data)
      
      if (response.ok) {
        setGeneratedImages(data.result);
      } else {
        console.error('Error generating images:', data.error);
        alert('Failed to generate images. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating images.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setGeneratedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
        
  return (
    <div className="p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <Recommendation 
        onDownload={() => handleDownloadRecommendations()} 
        uploadedImage={selectedImage}
        onUpload={handleUploadButtonClick}
        onRemoveImage={handleRemoveImage}
        generatedImages={generatedImages}
        isGenerating={isGenerating}
      />
    </div>
  )
}

export default page