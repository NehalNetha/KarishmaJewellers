import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import { CircleCheck, X, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

type ImageUploadProps = {
  onUpload: (file: File) => void;
}

const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  const [componentImages, setComponentImages] = useState<Record<string, string>>({});
  const [zipFile, setZipFile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.05);

  const handleDelete = () => {
    setPreviewUrl(null);
    setActiveTab('upload');
    setAnalysisData(null);
    setSegmentedImage(null);
    setComponentImages({});
    setZipFile(null);
    setError(null);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')) {
        setError('WebP format is not supported. Please upload JPEG, JPG, or PNG images.');
        return;
      }
      
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onUpload(file);
      processImage(file, confidenceThreshold);
    }
  }, [onUpload, confidenceThreshold]);

  const processImage = async (file: File, threshold: number) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('confidence', threshold.toString());
      console.log('Sending to backend:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        confidenceThreshold: threshold
      });

      const response = await fetch('http://localhost:8080/segment', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data.analysis);
        setSegmentedImage(data.segmentedImage);
        setComponentImages(data.componentImages);
        setZipFile(data.zipFile);
        setActiveTab('annotations');
      } else {
        const errorData = await response.json();
        console.error('Error processing image:', errorData);
        alert('Error processing image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const handleDownload = () => {
    if (zipFile) {
      const link = document.createElement('a');
      link.href = zipFile.data;
      link.download = zipFile.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newValue = value / 100;
    setConfidenceThreshold(newValue);
    console.log('Raw slider value:', value);
    console.log('New threshold set to:', newValue);
  };

  return (
    <div className="bg-white rounded-xl px-10 max-w-6xl mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h2 className="text-3xl font-bold mb-3">Detect & Count Jewels</h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Upload a jewellery image, and our AI will count the jewels instantly.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          <div {...getRootProps()} className={`border-2 border-dashed ${error ? 'border-red-400' : 'border-gray-300'} rounded-2xl px-12 flex flex-col items-center justify-center min-h-[400px] cursor-pointer hover:border-green-900 transition-colors`}>
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
                  width={400}
                  height={400}
                  className="object-contain max-h-[500px] rounded-lg"
                />
              </div>
            ) : (
              <>
                <Image 
                  src="/Cloud.svg" 
                  alt="Logo" 
                  width={250}
                  height={250}
                  className="object-contain"
                />
                <p className="text-gray-700 text-lg mt-4">
                  {isDragActive ? "Drop the image here" : "Drop your image here, or "} 
                  <span className="text-green-900 font-medium">browse</span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Supported formats: JPEG, JPG, PNG
                </p>
              </>
            )}
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <button 
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
              className="bg-green-900 text-white py-2 px-6 rounded-md min-w-[128px] text-lg font-medium hover:bg-green-800 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Upload"}
            </button>
            
            <div className="w-full md:w-2/3 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Detection Sensitivity
                </label>
                <div className="text-sm font-medium text-green-900">
                  {confidenceThreshold.toFixed(2)}
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={confidenceThreshold * 100}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower values detect more items (0.01 - 0.10)
              </p>
            </div>
          </div>
        </div>

        {/* Right section remains unchanged */}
        <div>
          <h2 className="text-3xl font-bold mb-3">Annotated Jewellery</h2>
          <p className="text-gray-600 mb-8 text-lg">
            The provided image includes annotations for various components.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-between min-h-[400px]">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              {segmentedImage ? (
                <>
                  <div className="relative w-full max-w-md mb-6">
                    <img 
                      src={segmentedImage}
                      alt="Segmented Image"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>

                  <div className="w-full max-w-md mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Component Categories</h3>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(componentImages).map(([label, src]) => (
                          <div 
                            key={label} 
                            className="flex flex-col items-center bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="w-full aspect-square relative">
                              <img 
                                src={src}
                                alt={label}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                            <p className="text-gray-600 text-sm mt-2 text-center font-medium">
                              {label.replace(/_/g, ' ')} ({analysisData?.components[label] || 0})
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {analysisData && (
                    <div className="text-center mt-4">
                      <p className="text-green-900 font-medium mb-2">{analysisData.message}</p>
                    </div>
                  )}

                  <button
                    onClick={handleDownload}
                    className="mt-6 bg-green-900 text-white py-2 px-6 rounded-md text-lg font-medium hover:bg-green-800 transition-colors"
                  >
                    Download All Components
                  </button>
                </>
              ) : (
                <Image
                  src="/karishmaGray.svg"
                  alt="Logo"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>

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