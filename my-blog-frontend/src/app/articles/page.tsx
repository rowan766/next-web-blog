// src/app/articles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Eye, Tag } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Article, ArticlesResponse } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/articles');
      
      if (!response.data || !response.data.articles || !Array.isArray(response.data.articles)) {
        throw new Error('响应数据格式错误');
      }
      
      setArticles(response.data.articles);
      setTotal(response.data.total || 0);
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">博客文章</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">博客文章</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">😕 {error}</p>
          <button
            onClick={fetchArticles}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">博客文章</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">📝 还没有发布文章</p>
          <p className="text-gray-500">敬请期待更多精彩内容！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">博客文章</h1>
        <div className="text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            共 {total} 篇文章
          </span>
        </div>
      </div>
      
      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link href={`/articles/${article.id}`}>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                  
                  {article.excerpt && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                
                <div className="ml-6 flex flex-col items-end space-y-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {article.category?.name || '未分类'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'published' ? '✓ 已发布' : '📝 草稿'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{article.author?.username || '未知作者'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    <span>{article.viewCount} 浏览</span>
                  </div>
                </div>
                
                <Link href={`/articles/${article.id}`}>
                  <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors group">
                    阅读全文 
                    <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {/* 如果有多篇文章，可以在这里添加分页组件 */}
      {articles.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            显示了所有 {articles.length} 篇文章
          </p>
        </div>
      )}
    </div>
  );
}