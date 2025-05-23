// UserList.tsx
"use client";
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import AddUserModal from './AddUserModal';
import React, { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  name?: string;
  surname?: string;
  avatar_url?: string;
  user_metadata?: {
    name?: string;
    surname?: string;
    avatar_url?: string;
    role?: string;
  };
}

const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.user_metadata?.role === 'ADMIN');
    };
    checkAdminStatus();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
    
      // Map the users to include metadata
      const usersWithMetadata = data.users.map((user: User) => ({
        ...user,
        name: user.user_metadata?.name || '',
        surname: user.user_metadata?.surname || '',
        avatar_url: user.user_metadata?.avatar_url || '',
      }));
    
      setUsers(usersWithMetadata);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = (newUser: { email: string; role: string }) => {
    setUsers(prev => [...prev, {
      id: Date.now().toString(), // Temporary ID until refresh
      email: newUser.email,
      role: newUser.role,
      created_at: new Date().toISOString()
    }]);
    fetchUsers(); // Refresh the list
  };

  const handleDeleteUser = async (userEmail: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }
  
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email: userEmail }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }
    
      setUsers(prev => prev.filter(user => user.email !== userEmail));
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 lg:px-16 py-6 sm:py-11">Loading users...</div>;
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-6 sm:py-11">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">User List</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {users.map((user, index) => (
          <div 
            key={user.id || user.email || index}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg p-3 sm:p-4 sm:pr-6 space-y-2 sm:space-y-0 ${
              user.role === 'ADMIN' 
                ? 'border-2 border-[#073320] bg-white' 
                : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm sm:text-base">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={`${user.name || user.email}'s avatar`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.email[0].toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1 sm:flex-none">
                {(user.name || user.surname) && (
                  <p className="text-sm font-medium truncate">
                    {[user.name, user.surname].filter(Boolean).join(' ')}
                  </p>
                )}
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                <p className="text-xs text-gray-400">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm font-medium">
                {user.role?.toUpperCase() || 'USER'}
              </span>
              {user.role !== 'ADMIN' && (
                <button 
                  onClick={() => handleDeleteUser(user.email)}
                  className="text-red-500 hover:text-red-600 transition-colors p-1 sm:p-0"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        ))}

        <button 
          onClick={() => isAdmin && setIsModalOpen(true)}
          className={`flex items-center justify-center gap-2 text-white rounded-lg p-3 sm:p-4 transition-colors bg-gradient-to-r from-[#176043] to-[#0C3825] text-sm sm:text-base ${
            !isAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
          disabled={!isAdmin}
          title={!isAdmin ? "Only administrators can add users" : ""}
        >
          <span>Add a user</span>
          <Plus size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
      
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};

export default UserList;