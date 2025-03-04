"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, ImageIcon, Lock, Bell, Shield } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    avatar_url: ''
  });
  const supabase = getSupabaseBrowserClient();
  
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData({
          name: user.user_metadata?.name || '',
          surname: user.user_metadata?.surname || '',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          avatar_url: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('surname', formData.surname);
      submitData.append('email', formData.email);
      submitData.append('avatar_url', formData.avatar_url);
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        body: submitData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        avatar_url: data.avatar_url || prev.avatar_url
      }));
      setAvatarFile(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, avatar_url: '' }));
    setAvatarFile(null);
  };

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-16">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="text-gray-500 mt-2 mb-12">Manage your account settings and preferences</p>

      <div className="space-y-8">
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-gray-500 mt-2">Set your account details</p>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
              <div className="space-y-6">
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Surname</label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                      placeholder="Enter your surname"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#073320] shadow-lg relative">
                    {formData.avatar_url ? (
                      <Image
                        src={formData.avatar_url || '/avatars/default-avatar.png'}
                        alt="Profile"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 128px) 100vw, 128px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {loading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4 justify-center">
                    <label className="text-sm text-gray-600 flex items-center gap-1 cursor-pointer hover:text-[#073320] transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Pencil size={16} /> Edit photo
                    </label>
                    {formData.avatar_url && (
                      <button 
                        className="text-sm text-red-500 flex items-center gap-1 hover:text-red-700 transition-colors"
                        onClick={handleRemoveAvatar}
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={fetchUserProfile}
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2 bg-[#073320] text-white rounded-md hover:bg-[#052616] transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      {/* Password Section */}
      <div className="space-y-8 mt-12 border-t pt-12">
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock size={20} />
              Security
            </h2>
            <p className="text-gray-500 mt-2">Manage your security preferences</p>
          </div>
          
          <div className="flex-1">
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="text-[#073320] hover:text-[#052616] font-medium"
            >
              Change Password
            </button>

            {showPasswordSection && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-[#073320] text-white rounded-md hover:bg-[#052616] transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

     

      {/* Account Management Section */}
      <div className="space-y-8 mt-12 border-t pt-12">
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield size={20} />
              Account
            </h2>
            <p className="text-gray-500 mt-2">Manage your account preferences</p>
          </div>
          
          <div className="flex-1">
            <button
              className="text-red-500 hover:text-red-700 font-medium"
              onClick={() => {
                // Add delete account logic
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Handle account deletion
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={fetchUserProfile}
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2 bg-[#073320] text-white rounded-md hover:bg-[#052616] transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
  );
};

export default Settings;