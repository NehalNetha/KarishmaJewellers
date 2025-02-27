"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

function Page() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-b from-green-50 to-white py-20 px-4"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {}
        }}
        transition={{ staggerChildren: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="flex flex-col items-center text-center mb-12"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src="/karishmaGray.svg" 
              alt="Karishma Jewellery Logo" 
              width={180} 
              height={180} 
              className="mb-8"
            />
            <h1 className="text-5xl font-bold text-green-900 mb-6">Karishma Jewellery</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Advanced AI-powered jewellery detection and counting system for inventory management and quality control.
            </p>
          </motion.div>

          <motion.div 
            className="flex justify-center"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/annotation" className="bg-green-900 text-white py-3 px-8 rounded-md text-lg font-medium hover:bg-green-800 transition-colors">
              Try Jewel Detection
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-green-900"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Upload Image",
                description: "Upload a high-quality image of your jewellery collection or individual pieces.",
                icon: "/cloud.svg"
              },
              {
                title: "AI Processing",
                description: "Our advanced AI model detects and counts individual jewels with high precision.",
                icon: "/karishmaGray.svg"
              },
              {
                title: "Download Results",
                description: "Get detailed annotations and counts of all jewellery items in your image.",
                icon: "/cloud.svg"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.5 + (index * 0.2) }}
              >
                <div className="bg-green-50 p-4 rounded-full mb-6">
                  <Image 
                    src={feature.icon} 
                    alt={feature.title} 
                    width={40} 
                    height={40} 
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About Project Section */}
      <div className="py-20 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-900">About The Project</h2>
              <p className="text-gray-600 mb-6">
                Karishma Jewellery AI is an innovative solution designed to streamline inventory management 
                and quality control processes for jewellery businesses. Using advanced computer vision 
                and machine learning algorithms, our system can accurately detect and count various types 
                of jewellery items from a single image.
              </p>
              <p className="text-gray-600">
                Whether you're managing large inventory or need precise counts for quality assurance, 
                our tool provides fast and accurate results, saving you time and reducing human error.
              </p>
            </div>
            <div className="flex justify-center">
              <motion.div 
                className="relative w-80 h-80 border-2 border-dashed border-green-900 rounded-2xl p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image 
                  src="/karishmaGray.svg" 
                  alt="Jewellery Detection" 
                  fill
                  className="object-contain p-8"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6 text-green-900"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1 }}
          >
            Ready to try it yourself?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.2 }}
          >
            <Link href="/annotation" className="bg-green-900 text-white py-3 px-8 rounded-md text-lg font-medium hover:bg-green-800 transition-colors">
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Page