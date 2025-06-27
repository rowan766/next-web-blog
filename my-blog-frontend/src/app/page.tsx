// src/app/page.tsx
'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('未测试');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await api.get('/articles');
      const articlesCount = response.data.articles?.length || response.data.length || 0;
      setApiStatus(`成功连接 - 获取到 ${articlesCount} 篇文章`);
    } catch (error: any) {
      setApiStatus(`连接失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到我的博客
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          一个基于 Next.js 的现代博客应用
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">API 连接测试</h3>
          <p className="text-sm text-gray-600 mb-4">
            状态: <span className="font-medium">{apiStatus}</span>
          </p>
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '测试中...' : '测试 API 连接'}
          </button>
        </div>
      </div>
    </div>
  );
}