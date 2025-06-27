'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { setAuthToken, setUser } from '@/lib/auth';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, '请输入用户名或邮箱'),
  password: z.string().min(1, '请输入密码'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login } = useAuth();

  // 获取重定向URL
  const returnUrl = searchParams.get('from') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // 如果已经登录，重定向到目标页面
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    try {
      // 调用后端登录接口
      const response = await api.post('/auth/login', data);
      
      const { access_token, user, message } = response.data;

      // 保存认证信息到 localStorage
      setAuthToken(access_token);
      setUser(user);
      
      // 更新全局认证状态
      login(user);
      
      // 显示成功消息
      console.log(message || '登录成功');
      
      // 跳转到目标页面
      router.push(returnUrl);
      
    } catch (err: any) {
      console.error('登录失败:', err);
      
      // 处理不同类型的错误
      if (err.response?.status === 401) {
        setError('root', { 
          type: 'manual', 
          message: '用户名或密码错误' 
        });
      } else if (err.response?.status === 400) {
        setError('root', { 
          type: 'manual', 
          message: '请求格式错误，请检查输入' 
        });
      } else {
        setError('root', { 
          type: 'manual', 
          message: err.response?.data?.message || '登录失败，请稍后重试' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 如果已经登录，显示跳转提示
  if (isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">您已登录，正在跳转...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 头部 */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">登录到你的账户</h2>
          <p className="mt-2 text-sm text-gray-600">
            {returnUrl !== '/' ? (
              <span className="text-blue-600">登录后将跳转到之前的页面</span>
            ) : (
              '访问博客管理功能'
            )}
          </p>
        </div>

        {/* 登录表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* 用户名或邮箱输入 */}
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-2">
                用户名或邮箱
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('usernameOrEmail')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入用户名或邮箱"
                  autoComplete="username"
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.usernameOrEmail.message}</p>
              )}
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* 全局错误信息 */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.root.message}</p>
            </div>
          )}

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                登录中...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                登录
              </>
            )}
          </button>

          {/* 其他选项 */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              还没有账户？
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                联系管理员注册
              </a>
            </p>
          </div>
        </form>

        {/* 测试账户信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">测试提示</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>请使用您注册的用户名/邮箱和密码登录</p>
            <p>如需注册新账户，请联系管理员</p>
          </div>
        </div>
      </div>
    </div>
  );
}