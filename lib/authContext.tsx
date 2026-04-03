"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from './mockData';
import { initDb, getUsers } from './db';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (newUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initDb(); // Initialize mock local DB
    const storedUser = localStorage.getItem('ss_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const allUsers = await getUsers();
    const foundUser = (allUsers as any).find((u: any) => u.email === email && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem('ss_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);
      
      // Redirect based on role
      if (foundUser.role === 'admin') router.push('/admin');
      else if (foundUser.role === 'client') router.push('/client');
      else if (foundUser.role === 'attendee') router.push('/attendee/scan-qr');
      
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('ss_user');
    setUser(null);
    router.push('/'); // Go to homepage, not login
  };

  const updateUser = (newUserData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newUserData };
    localStorage.setItem('ss_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Route protection — booking & contact require login; dashboards require login + correct role
  useEffect(() => {
    if (isLoading) return;

    const isAdminRoute = pathname.startsWith('/admin');
    const isClientRoute = pathname.startsWith('/client');
    const isAttendeeRoute = pathname.startsWith('/attendee');
    const isBookingRoute = pathname.startsWith('/booking');
    const isServicesRoute = pathname.startsWith('/services');
    const isContactRoute = pathname.startsWith('/contact');

    // Redirect unauthenticated users away from protected roles or specific pages (booking)
    if (!user && (isAdminRoute || isClientRoute || isAttendeeRoute || isBookingRoute)) {
      router.push('/login');
    }
    // If a wrong-role user lands on a dashboard, redirect them to their own
    if (user && isAdminRoute && user.role !== 'admin') router.push('/client');
    if (user && isClientRoute && user.role !== 'client' && user.role !== 'admin') router.push('/admin');
  }, [user, pathname, isLoading, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
