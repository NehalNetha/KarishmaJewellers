// AddUserModal.tsx
"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSupabaseBrowserClient } from '@/lib/supabase/client'; // Make sure this path is correct

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newUser: { email: string; role: string }) => void;
}

const AddUserModal = ({ isOpen, onClose, onAdd }: AddUserModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = getSupabaseBrowserClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });
  
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
  
      toast.success('User created successfully');
      onAdd({
        email: formData.email,
        role: formData.role
      });
      setFormData({ email: '', password: '', role: 'USER' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      toast.error(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-8 w-[500px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add User</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
              placeholder="Enter email address"
              required
            />
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
                placeholder="Enter password"
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
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#073320] text-white py-3 rounded-md hover:bg-[#052616] transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;