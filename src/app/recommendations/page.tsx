"use client"
import React, { useState } from 'react'
import Recommendation from '../(components)/Recommendation'

type Props = {}

const page = (props: Props) => {
        const [selectedImage, setSelectedImage] = useState<File | null>(null);

        const handleDownloadRecommendations = () => {
          // Implement download functionality here
          console.log("Downloading recommendations...");
          // For example:
          // - Create a download link
          // - Trigger a download API call
          // - Generate a PDF or ZIP file
        };

        const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            setSelectedImage(file);
            console.log("Image uploaded:", file.name);
          }
        };
        
  return (
    <div className="p-4">
      

      <Recommendation 
        onDownload={() => handleDownloadRecommendations()} 
        uploadedImage={selectedImage}
      />
    </div>
  )
}

export default page