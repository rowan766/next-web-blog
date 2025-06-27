// src/app/admin/create-article/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Eye, ArrowLeft, Tag, FileText } from 'lucide-react';
import api from '@/lib/api';
import { Category } from '@/types';
import RouteGuard from '@/components/auth/RouteGuard';

const articleSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题过长'),
  excerpt: z.string().max(500, '摘要过长').optional(),
  content: z.string().min(1, '内容不能为空'),
  categoryId: z.number().min(1, '请选择分类'),
  status: z.enum(['draft', 'published']),
  tags: z.string().optional(),
});

type ArticleForm = z.infer<typeof articleSchema>;

function CreateArticleContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      status: 'draft',
    },
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('获取分类失败:', err);
    }
  };

  const onSubmit = async (data: ArticleForm) => {
    setIsLoading(true);
    setError('');

    try {
      // 处理标签
      const tags = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const articleData = {
        ...data,
        tags,
        categoryId: Number(data.categoryId),
      };

      const response = await api.post('/articles', articleData);
      
      // 跳转到文章详情页
      router.push(`/articles/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '发布文章失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setValue('status', 'draft');
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    handleSubmit(onSubmit)();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>
          <h1 className="text-3xl font-bold text-gray-900">发布文章</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? '编辑' : '预览'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {!previewMode ? (
            <>
              {/* 标题 */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="输入文章标题..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* 摘要 */}
              <div className="mb-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  摘要
                </label>
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="输入文章摘要..."
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
                )}
              </div>

              {/* 分类和标签 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    分类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('categoryId', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">请选择分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <input
                    {...register('tags')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="用逗号分隔多个标签..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    例如：React, TypeScript, 前端开发
                  </p>
                </div>
              </div>

              {/* 内容 */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('content')}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="输入文章内容..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  支持 Markdown 语法
                </p>
              </div>
            </>
          ) : (
            /* 预览模式 */
            <div className="prose prose-lg max-w-none">
              <h1>{watchedTitle || '未命名文章'}</h1>
              <div 
                className="text-gray-800 leading-relaxed whitespace-pre-wrap"
              >
                {watchedContent || '暂无内容'}
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {!previewMode && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600">
              <FileText className="w-4 h-4 inline mr-1" />
              草稿会自动保存
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>保存草稿</span>
              </button>
              
              <button
                type="button"
                onClick={handlePublish}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Tag className="w-4 h-4" />
                <span>{isLoading ? '发布中...' : '发布文章'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default function CreateArticlePage() {
  return (
    <RouteGuard requireAuth={true}>
      <CreateArticleContent />
    </RouteGuard>
  );
}