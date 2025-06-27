// src/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getUser, getAuthToken, logout as logoutUtil } from '@/lib/auth';

// 全局状态（简化版本，不使用 Context）
let globalUser: User | null = null;
let globalIsLoading = true;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(globalUser);
  const [isLoading, setIsLoading] = useState<boolean>(globalIsLoading);

  useEffect(() => {
    const listener = () => {
      setUser(globalUser);
      setIsLoading(globalIsLoading);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const refreshAuth = () => {
    globalIsLoading = true;
    notifyListeners();
    
    const token = getAuthToken();
    const userData = getUser();
    
    if (token && userData) {
      globalUser = userData;
    } else {
      globalUser = null;
    }
    
    globalIsLoading = false;
    notifyListeners();
  };

  const login = (userData: User) => {
    globalUser = userData;
    globalIsLoading = false;
    notifyListeners();
  };

  const logout = () => {
    globalUser = null;
    globalIsLoading = false;
    logoutUtil();
    notifyListeners();
  };

  // 初始化
  useEffect(() => {
    if (globalIsLoading) {
      refreshAuth();
    }
  }, []);

  const isAuthenticated = globalUser !== null;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
  };
};