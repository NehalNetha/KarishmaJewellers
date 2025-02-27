import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import { CircleCheck, X } from 'lucide-react';  // Add X icon import
import { useDropzone } from 'react-dropzone';

type ImageUploadProps = {
  onUpload: (file: File) => void;
}

const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDelete = () => {
    setPreviewUrl(null);
    setActiveTab('upload');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onUpload(file);
      setActiveTab('annotations');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  return (
    <div className="bg-white rounded-xl px-10 max-w-6xl mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Left section */}
        <div>
          <h2 className="text-3xl font-bold mb-3">Detect & Count Jewels</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Upload a jewellery image, and our AI will count the jewels instantly.
          </p>
          
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center h-64 cursor-pointer hover:border-green-900 transition-colors">
            <input {...getInputProps()} />
            {previewUrl ? (
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <Image 
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="object-contain max-h-40"
                />
              </div>
            ) : (
              <>
                <Image 
                  src="/cloud.svg" 
                  alt="Logo" 
                  width={200} 
                  height={200}
                  className="object-contain"
                />
                <p className="text-gray-700 text-lg">
                  {isDragActive ? "Drop the image here" : "Drop your image here, or "} 
                  <span className="text-green-900 font-medium">browse</span>
                </p>
              </>
            )}
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
              className="mt-6 bg-green-900 text-white py-2 px-6 rounded-md w-32 text-lg font-medium hover:bg-green-800 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>
        
        {/* Right section */}
        <div>
          <h2 className="text-3xl font-bold mb-3">Annotated Jewellery</h2>
          <p className="text-gray-600 mb-8 text-lg">
            The provided image includes annotations for various components.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-between h-64">
            <div className="flex-1 flex items-center justify-center">
              <Image
                src="/karishmaGray.svg"
                alt="Logo"
                width={200}
                height={200}
                className="object-contain "
              />
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <button className="mt-6 bg-green-900 text-white py-2 px-6 rounded-md  text-lg items-center font-medium hover:bg-green-800 transition-colors">
              Download
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="mt-12 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <CircleCheck 
              className={`w-10 h-10 ${
                activeTab === 'upload' 
                  ? 'text-green-900 fill-green-900 stroke-white' 
                  : 'text-green-900 stroke-green-900'
              }`}
            />
            <span className="mt-2 text-base font-medium">Upload</span>
          </div>
          
          <div className="w-32 h-[2px] bg-green-900"></div>
          
          <div className="flex flex-col items-center">
            <CircleCheck 
              className={`w-10 h-10 ${
                activeTab === 'annotations' 
                  ? 'text-green-900 fill-green-900 stroke-white' 
                  : 'text-gray-300 fill-gray-500 '
              }`}
            />
            <span className="mt-2 text-base font-medium">Annotations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;