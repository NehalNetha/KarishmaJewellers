"use client"
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

function Page() {
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const aboutRef = useRef(null)
  const ctaRef = useRef(null)
  
  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px 0px" })
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px 0px" })
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px 0px" })
  
  // Parallax effect for hero section
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
  
  const staggerChildren = {
    hidden: {},
    visible: {}
  }
  
  const slideIn = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  }
  
  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  }
  
  const popUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="bg-gradient-to-b from-green-50 to-white py-20 px-4 relative"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={staggerChildren}
        transition={{ staggerChildren: 0.2 }}
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-green-100 opacity-30"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-green-100 opacity-20"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut" 
          }}
        />
        
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="flex flex-col items-center text-center mb-12"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image 
                src="/karishmaGray.svg" 
                alt="Karishma Jewellery Logo" 
                width={180} 
                height={180} 
                className="mb-8"
              />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold text-green-900 mb-6"
              variants={popUp}
              transition={{ duration: 0.7 }}
            >
              Karishma Jewellery
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl"
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Advanced AI-powered jewellery detection and counting system for inventory management and quality control.
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex justify-center"
            variants={popUp}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/annotation" className="bg-green-900 text-white py-3 px-8 rounded-md text-lg font-medium hover:bg-green-800 transition-colors">
                Try Jewel Detection
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 px-4" ref={featuresRef}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-green-900"
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
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
                initial={{ opacity: 0, y: 50 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.2) }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  borderColor: "#10B981"
                }}
              >
                <motion.div 
                  className="bg-green-50 p-4 rounded-full mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image 
                    src={feature.icon} 
                    alt={feature.title} 
                    width={40} 
                    height={40} 
                    className="object-contain"
                  />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-green-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About Project Section */}
      <div className="py-20 px-4 bg-green-50" ref={aboutRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            variants={staggerChildren}
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.div variants={slideIn} transition={{ duration: 0.7 }}>
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
            </motion.div>
            <motion.div 
              className="flex justify-center"
              variants={slideInRight}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="relative w-80 h-80 border-2 border-dashed border-green-900 rounded-2xl p-4"
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  borderColor: "#047857"
                }}
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 20px rgba(16, 185, 129, 0.3)", "0px 0px 0px rgba(16, 185, 129, 0)"]
                }}
                transition={{ 
                  boxShadow: {
                    repeat: Infinity,
                    duration: 2
                  },
                  type: "spring", 
                  stiffness: 300 
                }}
              >
               
                  <Image 
                    src="/karishmaGray.svg" 
                    alt="Jewellery Detection" 
                    fill
                    className="object-contain p-8"
                  />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4" ref={ctaRef}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6 text-green-900"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isCtaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.7 }}
          >
            Ready to try it yourself?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/annotation" className="bg-green-900 text-white py-3 px-8 rounded-md text-lg font-medium hover:bg-green-800 transition-colors inline-block">
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Page