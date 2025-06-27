// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User as UserIcon, Plus, Settings } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              我的博客
            </Link>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              首页
            </Link>
            <Link 
              href="/articles" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              文章
            </Link>
            <Link 
              href="/projects" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              项目
            </Link>
            
            {/* 管理功能（仅登录用户可见） */}
            {isAuthenticated && (
              <>
                <Link 
                  href="/admin/create-article" 
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>写文章</span>
                </Link>
                <Link 
                  href="/admin/articles" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>管理</span>
                </Link>
              </>
            )}
            
            {/* 认证状态显示 */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">
                    你好, <span className="font-medium">{user?.username}</span>
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>登录</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}