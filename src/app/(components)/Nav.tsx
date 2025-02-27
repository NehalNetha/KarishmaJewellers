"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PenSquare, Users, Settings, LogOut, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { signOutAction } from '../actions'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Annotation', href: '/annotation', icon: <PenSquare size={20} /> },
  { label: 'Users', href: '/users', icon: <Users size={20} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
]

function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const getUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserName(user.email.split('@')[0])
      }
    }
    getUserName()
  }, [])

  const handleLogout = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className='flex flex-row p-8 bg-[#073320] justify-between items-center text-white'>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Link href="/" className="hover:opacity-80">
          <Image src="/logo.png" alt="Logo" width={200} height={200} className="" />
        </Link>
      </motion.div>

      <div className='flex flex-row gap-10 items-center'>
        {navItems.map((item) => (
          <motion.div
            key={item.href}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                pathname === item.href 
                  ? 'bg-white text-[#073320]' 
                  : 'hover:opacity-80'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </motion.div>
        ))}
        
        {userName && (
          <div className="flex items-center gap-2 text-sm">
            <User size={20} />
            <span>{userName}</span>
          </div>
        )}

        <button 
          className="flex items-center gap-2 hover:opacity-80 text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Nav

