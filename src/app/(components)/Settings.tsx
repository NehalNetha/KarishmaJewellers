"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, ImageIcon, Lock, AlertTriangle } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useUser } from './UserContext';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  surname: string;
  email: string;
  avatar_url: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const { userData, setUserData } = useUser();
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    avatar_url: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  // State for account deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const initializeUserData = async () => {
      // Fetch fresh user data
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (user) {
        setFormData({
          name: user.user_metadata.name || '',
          surname: user.user_metadata.surname || '',
          email: user.email || '',
          avatar_url: user.user_metadata.avatar_url || '',
        });
        
        // Update UserContext data as well
        setUserData({
          name: user.user_metadata.name || '',
          surname: user.user_metadata.surname || '',
          email: user.email || '',
          avatarUrl: user.user_metadata.avatar_url || null,
          isLoggedIn: true,
        });
      }
      
      setIsInitialized(true);
    };

    initializeUserData();
  }, [supabase, setUserData]);

  if (!isInitialized) {
    return (
      <div className="p-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#073320] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          avatar_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`${Date.now()}_${avatarFile.name}`, avatarFile);
        if (uploadError) throw uploadError;

        avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileData.path).data.publicUrl;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          surname: formData.surname,
          avatar_url: avatarUrl,
        },
      });
      if (error) throw error;

      setUserData((prev) => ({
        ...prev,
        name: formData.name,
        surname: formData.surname,
        avatarUrl: avatarUrl,
      }));
      setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));
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
    setFormData((prev) => ({ ...prev, avatar_url: '' }));
    setAvatarFile(null);
    setUserData((prev) => ({ ...prev, avatarUrl: null }));
  };


  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordSection(false);
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete my account') {
      toast.error('Please type "delete my account" to confirm');
      return;
    }

    setLoading(true);
    try {
      
      // Optional: Clean up user data (e.g., delete avatar from storage)
      if (userData.avatarUrl) {
        const fileName = userData.avatarUrl.split('/').pop();
        try {
          await supabase.storage.from('avatars').remove([fileName || '']);
        } catch (avatarError) {
          console.error('Error removing avatar:', avatarError);
          // Continue with account deletion even if avatar removal fails
        }
      }
      
      // Get the user ID from the session
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error('Could not determine user ID from session');
      }
      
      
      // Call the API route to delete the account
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API response error:', responseData);
        throw new Error(responseData.error || 'Failed to delete account');
      }
      
      
      // Sign out the user after successful deletion
      await supabase.auth.signOut();
      
      toast.success('Account deleted successfully');
      setUserData({
        name: '',
        surname: '',
        email: '',
        avatarUrl: null,
        isLoggedIn: false,
      });
      router.push('/'); // Redirect to homepage
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <div className="p-4 md:p-16">
      <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>
      <p className="text-gray-500 mt-2 mb-8 md:mb-12">Manage your account settings and preferences</p>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:gap-16">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-gray-500 mt-2">Set your account details</p>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    disabled // Email is typically not editable via auth.updateUser
                  />
                </div>
              </div>

              <div className="flex flex-col items-center mt-6 lg:mt-0">
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

        <div className="flex justify-center md:justify-end gap-4 pt-4">
          <button
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() =>
              setFormData({
                name: userData.name,
                surname: userData.surname,
                email: userData.email,
                avatar_url: userData.avatarUrl || '',
              })
            }
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

      <div className="space-y-8 mt-8 md:mt-12 border-t pt-8 md:pt-12">
        <div className="flex flex-col md:flex-row md:gap-16">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
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
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
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

            <div className="mt-8">
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete Account
              </button>

              {showDeleteConfirm && (
                <div className="mt-4 space-y-4 p-4 border border-red-300 rounded-md bg-red-50">
                  <div className="flex items-start sm:items-center gap-2 text-red-700">
                    <AlertTriangle size={20} className="flex-shrink-0 mt-1 sm:mt-0" />
                    <p className="font-medium">This action cannot be undone.</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Type <strong>"delete my account"</strong> to confirm.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    placeholder="delete my account"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

