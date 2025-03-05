"use client"
import React from 'react'
import ImageUpload from '../(components)/ImageUpload';

type Props = {}

function page({}: Props) {
  const handleUpload = (file: File) => {
    // We don't need to do anything here as the ImageUpload component
    // now handles the API call and processing directly
  }


  return (
    <div>
      <ImageUpload onUpload={handleUpload} />
    </div>
  )
}

export default page