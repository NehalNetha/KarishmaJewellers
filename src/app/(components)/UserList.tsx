// UserList.tsx
"use client";
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import AddUserModal from './AddUserModal';
import React, { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
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

      setUsers(data.users);
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

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 lg:px-16 py-6 sm:py-11">Loading users...</div>;
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-6 sm:py-11">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">User List</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {users.map((user) => (
          <div 
            key={user.id}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg p-3 sm:p-4 sm:pr-6 space-y-2 sm:space-y-0 ${
              user.role === 'ADMIN' 
                ? 'border-2 border-[#073320] bg-white' 
                : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm sm:text-base">
                {user.email[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 sm:flex-none">
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
                  onClick={() => handleDeleteUser(user.id)}
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