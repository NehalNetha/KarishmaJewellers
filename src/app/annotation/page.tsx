"use client"
import React, { useState } from 'react'
import ImageUpload from '../(components)/ImageUpload';

type Props = {}

function page({}: Props) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleUpload = (file: File) => {
      setUploadedFile(file);
      // We don't need to do anything else here since the ImageUpload component
      // now handles the API call and processing directly
    }
  
    return (
      <div>
        <ImageUpload onUpload={handleUpload} />
      </div>
    )
}

export default page