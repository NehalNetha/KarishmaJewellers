"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PenSquare, Users, Settings, LogOut, User, Lightbulb } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOutAction } from '../actions';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useUser } from './UserContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Annotation', href: '/annotation', icon: <PenSquare size={20} /> },
  { label: 'Users', href: '/users', icon: <Users size={20} /> },
  { label: 'Recommendations', href: '/recommendations', icon: <Lightbulb size={20} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

const Nav: React.FC = () => {
  const { userData } = useUser(); // Use context for profile picture and username
  const pathname = usePathname();
  const router = useRouter();
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // REMOVED LOCAL STATE FOR USERNAME AND AVATAR
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        // REMOVED LOCAL STATE UPDATES FOR USERNAME/AVATAR
      } else {
        setIsLoggedIn(false);
      }
    };

    getUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session) {
            setIsLoggedIn(true);
            // REMOVED LOCAL STATE UPDATES
          }
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          if (pathname !== '/') {
            router.push('/');
          }
        }
      }
    );

    setIsNavVisible(true);

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  const handleLogout = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        delay: 0.1,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.nav
        className="flex flex-row p-4 sm:p-8 bg-[#073320] justify-between items-center text-white shadow-lg relative z-50"
        initial="hidden"
        animate={isNavVisible ? 'visible' : 'hidden'}
        variants={navVariants}
      >
        {/* Logo */}
        <motion.div
          variants={logoVariants}
          whileHover={{
            scale: 1.05,
            filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.5))',
          }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="z-10"
        >
          <Link href="/" className="hover:opacity-80" onClick={handleLinkClick}>
            <Image src="/logo.png" alt="Logo" width={150} height={150} className="w-32 sm:w-[200px]" />
          </Link>
        </motion.div>

        {/* Right Side: Mobile Menu Toggle or Login Link */}
        <div className="flex items-center">
          {isLoggedIn ? (
            <motion.button
              className="lg:hidden z-10 p-2 hover:bg-[#0a4a2e] rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}>
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 hover:bg-[#0a4a2e] text-sm font-medium px-3 py-1.5 rounded-md transition-colors z-10 lg:hidden"
            >
              <User size={20} />
              Login
            </Link>
          )}

          {/* Navigation Items and User Info (Desktop + Mobile Menu) */}
          <motion.div
            className={`${
              isLoggedIn ? (isMobileMenuOpen ? 'flex' : 'hidden') : 'hidden'
            } lg:flex flex-col lg:flex-row absolute lg:relative top-full left-0 right-0 lg:top-auto bg-[#073320] lg:bg-transparent p-4 lg:p-0 gap-4 lg:gap-10 items-start lg:items-center z-10`}
            variants={itemVariants}
          >
            {isLoggedIn &&
              navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  variants={itemVariants}
                  whileHover={{ y: -2, scale: 1.05, transition: { type: 'spring', stiffness: 400 } }}
                  whileTap={{ scale: 0.95 }}
                  custom={index}
                  className="w-full lg:w-auto"
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors w-full lg:w-auto ${
                      pathname === item.href ? 'bg-white text-[#073320]' : 'hover:bg-[#0a4a2e]'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <motion.div
                      animate={
                        pathname === item.href
                          ? { rotate: [0, 10, 0], scale: [1, 1.2, 1] }
                          : {}
                      }
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      {item.icon}
                    </motion.div>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full lg:w-auto">
              {isLoggedIn ? (
                <>
                  {userData.email && (
                    <motion.div
                      className="flex items-center gap-2 text-sm bg-[#0a4a2e] px-3 py-1.5 rounded-md w-full lg:w-auto justify-center lg:justify-start"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                    >
                      {userData.avatarUrl ? (
                        <Image
                          src={userData.avatarUrl}
                          alt="Profile"
                          width={20}
                          height={20}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} />
                      )}
                      <span>{userData.name || userData.email.split('@')[0]}</span>
                    </motion.div>
                  )}
                  <motion.button
                    className="flex items-center gap-2 hover:bg-[#0a4a2e] text-sm font-medium px-3 py-1.5 rounded-md transition-colors w-full lg:w-auto justify-center lg:justify-start"
                    onClick={handleLogout}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <LogOut size={20} />
                    </motion.div>
                    Logout
                  </motion.button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 hover:bg-[#0a4a2e] text-sm font-medium px-3 py-1.5 rounded-md transition-colors w-full lg:w-auto hidden lg:flex"
                >
                  <User size={20} />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Nav;