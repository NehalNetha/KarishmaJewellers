"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CircleCheck, X, Loader2, Download } from 'lucide-react';

type RecommendationProps = {
  onDownload?: () => void;
  uploadedImage?: File | null;
  onUpload?: () => void; // For upload button click handler
  onRemoveImage?: () => void; // Added prop for removing the image
  generatedImages?: string[]; // Array of generated image URLs
  isGenerating?: boolean; // Flag to indicate if generation is in progress
}

const Recommendation = ({ 
  onDownload, 
  uploadedImage, 
  onUpload, 
  onRemoveImage, 
  generatedImages = [], 
  isGenerating = false 
}: RecommendationProps) => {
  // State for modal image viewer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  // Sample recommendation data - only used when no generated images are available
  const sampleRecommendations = [
    { id: 1, src: '/one.jpeg', alt: 'Diamond Necklace' },
    { id: 2, src: '/one.jpeg', alt: 'Emerald Necklace' },
    { id: 3, src: '/one.jpeg', alt: 'Ruby Necklace' },
    { id: 4, src: '/one.jpeg', alt: 'Sapphire Necklace' },
  ];

  // Use generated images if available, otherwise use sample data
  const recommendations = generatedImages.length > 0 
    ? generatedImages.map((url, index) => ({ id: index, src: url, alt: `Generated Design ${index + 1}` }))
    : sampleRecommendations;

  // Function to handle individual image download
  const handleDownloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Function to open the modal with a specific image
  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-white rounded-xl md:px-4 max-w-6xl mx-auto pb-6 sm:pb-10">
      {/* Progress Steps */}
      <div className="py-4 sm:py-8 flex justify-center items-center overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          <div className="flex flex-col items-center">
            <CircleCheck className="w-8 h-8 sm:w-10 sm:h-10 text-green-900 fill-green-900 stroke-white" />
            <span className="mt-2 text-sm sm:text-base font-medium">Upload</span>
          </div>
          
          <div className="w-16 sm:w-32 h-[2px] bg-green-900"></div>
          
          <div className="flex flex-col items-center">
            <CircleCheck className={`w-8 h-8 sm:w-10 sm:h-10 ${generatedImages.length > 0 ? "text-green-900 fill-green-900 stroke-white" : "text-gray-300 fill-gray-300 stroke-white"}`} />
            <span className="mt-2 text-sm sm:text-base font-medium">Suggestion</span>
          </div>
        </div>
      </div>

      {/* Uploaded Image Preview */}
      {uploadedImage && (
        <div className="mt-4 sm:mt-8 relative">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Uploaded Image</h3>
          <div className="max-w-md mx-auto relative">
            <button 
              onClick={onRemoveImage}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              aria-label="Remove image"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <img
              src={URL.createObjectURL(uploadedImage)}
              alt="Uploaded preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Recommendation Section */}
      <div className="mt-6 sm:mt-8">
        {/* Recommendation Heading and Upload/Generate Button Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Recommendation</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {generatedImages.length > 0 
                ? "Here is your personalized jewelry recommendation" 
                : "Below are few recommendation generated by our system"}
            </p>
          </div>
          <button 
            onClick={onUpload}
            disabled={isGenerating}
            className={`w-full sm:w-auto bg-green-900 text-white py-2 px-4 sm:px-6 rounded-md text-base sm:text-lg font-medium hover:bg-green-800 transition-colors flex items-center justify-center ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              uploadedImage ? 'Generate' : 'Upload'
            )}
          </button>
        </div>

        {/* Recommendation Grid */}
        <div className="bg-gray-100 rounded-xl p-3 sm:p-6 mb-4 sm:mb-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-900 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-700">Generating your recommendations...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                  <div className="relative group">
                    <img 
                      src={generatedImages[0]}
                      alt="Generated Design"
                      className="w-full h-auto object-cover cursor-pointer"
                      onClick={() => openModal(generatedImages[0])}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(generatedImages[0])}
                        className="bg-white text-green-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 mr-2"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDownloadImage(generatedImages[0], `jewelry-design.png`)}
                        className="bg-white text-green-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm font-medium text-gray-800">Generated Design</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // When no images have been generated yet, show a single message box
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-gray-700">Upload an image to get started</p>
              <p className="text-sm text-gray-500 mt-2">Generated images will appear here</p>
            </div>
          )}
        </div>

        {/* Download All Button - Only show when there are generated images */}
       
      </div>

      {/* Modal for full-size image view */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-white rounded-lg">
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <div className="p-2">
              <img 
                src={modalImageUrl} 
                alt="Full size design" 
                className="w-full h-auto"
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={() => handleDownloadImage(modalImageUrl, 'jewelry-design.png')}
                className="bg-green-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-800 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendation;