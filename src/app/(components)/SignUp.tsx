"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import bgTexture from '../../../public/texture.jpeg';
import { signUpAction } from '../actions';

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formDataObj = new FormData();
    formDataObj.append('email', formData.email);
    formDataObj.append('password', formData.password);
    formDataObj.append('name', formData.name); // You were missing this!
  
    try {
      // Add type assertion or define return type in the action
      const response = await signUpAction(formDataObj) as string;
      if (response?.includes('error')) {
        const message = decodeURIComponent(response.split('=')[1]);
        setError(message);
        toast.error(message);
      } else if (response?.includes('success')) {
        const message = decodeURIComponent(response.split('=')[1]);
        toast.success(message);
        router.push('/login');
      }
    } catch (err) {
      setError('An error occurred during sign up');
      toast.error('An error occurred during sign up');
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
      <Toaster position="top-center" />
      <div className="flex-1 flex items-center justify-center mb-[10rem]">
        <div className="bg-white rounded-3xl px-8 py-4 w-full max-w-md mx-4">
          <div className="mb-6">
           
            <h1 className="text-2xl font-semibold">Welcome to Karishma</h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  placeholder="Enter your password"
                  required
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

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#073320] text-white py-3 rounded-md hover:bg-[#052616] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Join'}
            </button>

            <div className="text-sm flex justify-between">
              <Link href="/login" className="text-[#073320] hover:underline">
                Already have an account? Login
              </Link>
              <Link href="/forgot-password" className="text-[#073320] hover:underline">
                Forgot password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;