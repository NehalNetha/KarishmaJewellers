"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PenSquare, Users, Settings, LogOut, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { signOutAction } from '../actions'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isNavVisible, setIsNavVisible] = useState(false)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const getUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserName(user.email.split('@')[0])
      }
    }
    getUserName()
    
    // Add animation on mount
    setIsNavVisible(true)
  }, [])

  const handleLogout = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300,
        delay: 0.1
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.nav 
        className='flex flex-row p-8 bg-[#073320] justify-between items-center text-white shadow-lg relative z-50'
        initial="hidden"
        animate={isNavVisible ? "visible" : "hidden"}
        variants={navVariants}
      >
        {/* Animated background element */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#073320] via-[#0a4a2e] to-[#073320] opacity-50 z-0"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ 
            duration: 15, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
        
        <motion.div
          variants={logoVariants}
          whileHover={{ 
            scale: 1.05,
            filter: "drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.5))"
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="z-10"
        >
          <Link href="/" className="hover:opacity-80">
            <Image src="/logo.png" alt="Logo" width={200} height={200} className="" />
          </Link>
        </motion.div>

        <motion.div 
          className='flex flex-row gap-10 items-center z-10'
          variants={itemVariants}
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              variants={itemVariants}
              whileHover={{ 
                y: -2,
                scale: 1.05,
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
              custom={index}
            >
              <Link 
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                  pathname === item.href 
                    ? 'bg-white text-[#073320]' 
                    : 'hover:bg-[#0a4a2e]'
                }`}
              >
                <motion.div
                  animate={pathname === item.href ? { 
                    rotate: [0, 10, 0],
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {item.icon}
                </motion.div>
                {item.label}
              </Link>
            </motion.div>
          ))}
          
          {userName && (
            <motion.div 
              className="flex items-center gap-2 text-sm bg-[#0a4a2e] px-3 py-1.5 rounded-md"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: ['0px 0px 0px rgba(255, 255, 255, 0)', '0px 0px 4px rgba(255, 255, 255, 0.3)', '0px 0px 0px rgba(255, 255, 255, 0)']
              }}
              transition={{ 
                boxShadow: {
                  repeat: Infinity,
                  duration: 2
                }
              }}
            >
              <User size={20} />
              <span>{userName}</span>
            </motion.div>
          )}

          <motion.button 
            className="flex items-center gap-2 hover:bg-[#0a4a2e] text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            onClick={handleLogout}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <LogOut size={20} />
            </motion.div>
            Logout
          </motion.button>
        </motion.div>
      </motion.nav>
    </AnimatePresence>
  );
}

export default Nav

