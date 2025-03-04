"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

// Define the shape of the user data
interface UserData {
  name: string;
  surname: string;
  email: string;
  avatarUrl: string | null;
  isLoggedIn: boolean;
}

// Define the context value type
interface UserContextValue {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

// Create the context with an initial undefined value, but we'll ensure it's always defined via the provider
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Props type for the provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const supabase = getSupabaseBrowserClient();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    surname: '',
    email: '',
    avatarUrl: null,
    isLoggedIn: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          name: user.user_metadata?.name || '',
          surname: user.user_metadata?.surname || '',
          email: user.email || '',
          avatarUrl: user.user_metadata?.avatar_url || null,
          isLoggedIn: true,
        });
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session) {
            setUserData({
              name: session.user.user_metadata?.name || '',
              surname: session.user.user_metadata?.surname || '',
              email: session.user.email || '',
              avatarUrl: session.user.user_metadata?.avatar_url || null,
              isLoggedIn: true,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUserData({
            name: '',
            surname: '',
            email: '',
            avatarUrl: null,
            isLoggedIn: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]); // Add supabase as a dependency to satisfy ESLint rules

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook with type safety and error handling for context usage outside provider
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};