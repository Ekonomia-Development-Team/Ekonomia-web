'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthUser {
  name: string;
  email: string;
  title?: string;
  initials?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = 'ekonomia:mock-user';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const wait = (min = 250, max = 650) =>
  new Promise<void>((resolve) => {
    const timeout = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, timeout);
  });

const buildUser = (email: string): AuthUser => {
  const name = 'John Don';
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return {
    name,
    email,
    title: 'Financial Strategist',
    initials,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch {
      // ignore corrupted storage
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((value: AuthUser | null) => {
    if (!value) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }, []);

  const login = useCallback(async ({ email }: { email: string; password: string }) => {
    await wait();
    const newUser = buildUser(email);
    setUser(newUser);
    persist(newUser);
  }, [persist]);

  const logout = useCallback(async () => {
    await wait(150, 350);
    setUser(null);
    persist(null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
