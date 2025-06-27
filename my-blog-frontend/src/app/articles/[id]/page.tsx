// src/app/articles/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, User, Eye, Tag, ArrowLeft, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Article } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const articleId = params.id;

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/articles/${articleId}`);
      setArticle(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return '今天';
    if (diffInDays === 1) return '昨天';
    if (diffInDays < 7) return `${diffInDays} 天前`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} 周前`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} 月前`;
    return `${Math.floor(diffInDays / 365)} 年前`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <LoadingSpinner />
        <p className="text-center text-gray-600 mt-4">正在加载文章...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </button>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">😕 {error}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              返回列表
            </button>
            <button
              onClick={fetchArticle}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </button>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">📄 文章不存在</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        返回文章列表
      </button>

      {/* 文章主体 */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 文章头部 */}
        <header className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </div>
            
            <div className="ml-6 flex flex-col items-end space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Tag className="w-4 h-4 mr-1" />
                {article.category?.name || '未分类'}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                article.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {article.status === 'published' ? '✓ 已发布' : '📝 草稿'}
              </span>
            </div>
          </div>
          
          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{article.author?.username || '未知作者'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(article.createdAt)}</span>
              <span className="ml-2 text-gray-400">({formatRelativeTime(article.createdAt)})</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              <span>{article.viewCount} 浏览</span>
            </div>
            {article.updatedAt !== article.createdAt && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>更新于 {formatDate(article.updatedAt)}</span>
              </div>
            )}
          </div>
        </header>

        {/* 文章内容 */}
        <div className="px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {article.content}
            </div>
          </div>
        </div>

        {/* 文章底部 */}
        <footer className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>文章 ID: {article.id}</p>
              {article.publishedAt && (
                <p>发布时间: {formatDate(article.publishedAt)}</p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                回到顶部
              </button>
              <button
                onClick={() => router.push('/articles')}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                更多文章
              </button>
            </div>
          </div>
        </footer>
      </article>

      {/* 相关文章推荐区域 (预留) */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">相关文章</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">暂无相关文章推荐</p>
          <p className="text-sm text-gray-500 mt-2">功能开发中...</p>
        </div>
      </div>
    </div>
  );
}