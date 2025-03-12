"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { forgotPasswordAction } from '../actions';
import toast from 'react-hot-toast';
import Link from 'next/link';
import bgTexture from '../../../public/texture.jpeg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log('Password reset initiated for email:', email);
  
    try {
      const formData = new FormData();
      formData.append('email', email);
      console.log('Sending password reset request to server...');
  
      try {
        const response = await forgotPasswordAction(formData);
        console.log('Server response received:', response);
        
        // Check if response is a URLSearchParams string
        if (typeof response === 'string') {
          console.log('Response is a string:', response);
          const searchParams = new URLSearchParams(response);
          const errorMessage = searchParams.get('error');
          const successMessage = searchParams.get('success');
          
          console.log('Parsed response - Error:', errorMessage, 'Success:', successMessage);
        
          if (errorMessage) {
            console.log('Error message found:', errorMessage);
            toast.error(errorMessage);
          } else if (successMessage) {
            console.log('Success message found:', successMessage);
            setSuccess(true);
            toast.success(successMessage);
          } else {
            console.log('No error or success message found in response');
            setSuccess(true); // Assume success if no error
            toast.success('Reset password link sent to your email');
          }
        } else {
          // Handle redirect response (the user will be redirected automatically)
          console.log('Response is not a string, likely a redirect');
          setSuccess(true);
          toast.success('Reset password link sent to your email');
        }
      } catch (error) {
        // Check if this is a Next.js redirect error (which is actually a success case)
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          console.log('Detected Next.js redirect - this is a success case');
          setSuccess(true);
          toast.success('Reset password link sent to your email');
          return; // Exit early as this is a success case
        }
        
        // If we get here, it's a real error
        throw error;
      }
    } catch (error) {
      console.error('Password reset error details:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast.error('An error occurred while sending the reset link');
    } finally {
      setLoading(false);
      console.log('Password reset request completed');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgTexture.src})`,
        backgroundColor: '#f5f5f5',
      }}
    >
      <div className="flex-1 flex items-center justify-center mb-[10rem]">
        <div className="bg-white rounded-3xl px-8 py-4 w-full max-w-md mx-4">
          <div className="flex flex-col items-center mb-6">
            <Image 
              src="/rlogo.svg" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="mb-4"
            />
            <h1 className="text-2xl font-semibold">Reset Password</h1>
            <p className="text-gray-600 text-center mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                Check your email for a link to reset your password.
              </div>
              <Link 
                href="/login" 
                className="text-[#073320] hover:underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#073320] text-white py-3 rounded-md hover:bg-[#052616] transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

            
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;