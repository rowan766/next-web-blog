// src/components/auth/RouteGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function RouteGuard({ 
  children, 
  requireAuth = false,
  redirectTo = '/login'
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 如果还在加载认证状态，等待
    if (isLoading) return;

    // 如果需要认证但用户未登录
    if (requireAuth && !isAuthenticated) {
      // 保存当前路径，登录后跳转回来
      const returnUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      router.push(`${redirectTo}?from=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // 如果不需要认证或者用户已登录
    setIsAuthorized(true);
  }, [isAuthenticated, isLoading, requireAuth, router, pathname, searchParams, redirectTo]);

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 显示未授权状态
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">需要登录</h2>
          <p className="text-gray-600 mb-6">请先登录后再访问此页面</p>
          <button
            onClick={() => router.push(redirectTo)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            前往登录
          </button>
        </div>
      </div>
    );
  }

  // 已授权，显示内容
  if (isAuthorized) {
    return <>{children}</>;
  }

  // 默认显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}