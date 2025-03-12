"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { resetPasswordAction } from '../actions';
import toast from 'react-hot-toast';
import Link from 'next/link';
import bgTexture from '../../../public/texture.jpeg';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('password', formData.password);
      formDataObj.append('confirmPassword', formData.confirmPassword);
      
      try {
        const response = await resetPasswordAction(formDataObj);
        
        if (typeof response === 'string') {
          const errorMessage = new URLSearchParams(response).get('error');
          toast.error(errorMessage || 'Failed to reset password');
        } else {
          setSuccess(true);
          toast.success('Password has been reset successfully');
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          setSuccess(true);
          toast.success('Password has been reset successfully');
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-semibold">Reset Your Password</h1>
            <p className="text-gray-600 text-center mt-2">
              Please enter your new password below
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                Your password has been reset successfully.
              </div>
              <Link 
                href="/login" 
                className="text-[#073320] hover:underline"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#073320] text-white py-3 rounded-md hover:bg-[#052616] transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;