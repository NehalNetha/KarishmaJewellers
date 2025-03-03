"use client"
import React from 'react'
import Recommendation from '../(components)/Recommendation'

type Props = {}

const page = (props: Props) => {
        const handleDownloadRecommendations = () => {
          // Implement download functionality here
          console.log("Downloading recommendations...");
          // For example:
          // - Create a download link
          // - Trigger a download API call
          // - Generate a PDF or ZIP file
        };
        
  return (
    <div>

        <Recommendation onDownload={() => handleDownloadRecommendations()} />
    </div>
  )
}

export default page