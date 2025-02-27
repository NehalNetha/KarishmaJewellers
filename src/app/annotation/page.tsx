"use client"
import React, { useEffect } from 'react'
import ImageUpload from '../(components)/ImageUpload';

type Props = {}

function page({}: Props) {
  const handleUpload = (file: File) => {
    // We don't need to do anything here as the ImageUpload component
    // now handles the API call and processing directly
    console.log('File uploaded:', file.name);
  }

  useEffect(() => {
    const test = async () => {
      try {
        const response = await fetch('http://localhost:8080/test', {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Test API response:', data);
        return data;
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    }

    test();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <div>
      <ImageUpload onUpload={handleUpload} />
    </div>
  )
}

export default page