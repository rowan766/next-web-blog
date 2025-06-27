// src/app/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Star, GitFork, ExternalLink, Calendar, Code, Github } from 'lucide-react';
import api from '@/lib/api';
import { Repository } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProjectsPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get<Repository[]>('/github/repositories');
      setRepositories(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      TypeScript: 'bg-blue-100 text-blue-800 border-blue-200',
      Python: 'bg-green-100 text-green-800 border-green-200',
      Java: 'bg-red-100 text-red-800 border-red-200',
      'C++': 'bg-purple-100 text-purple-800 border-purple-200',
      C: 'bg-gray-100 text-gray-800 border-gray-200',
      Go: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      Rust: 'bg-orange-100 text-orange-800 border-orange-200',
      PHP: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Vue: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      React: 'bg-sky-100 text-sky-800 border-sky-200',
      HTML: 'bg-pink-100 text-pink-800 border-pink-200',
      CSS: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[language] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的项目</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的项目</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">😕 {error}</p>
          <button
            onClick={fetchRepositories}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的项目</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">🚀 还没有找到项目</p>
          <p className="text-gray-500">GitHub 仓库列表为空或正在同步中</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的项目</h1>
          <p className="text-gray-600">GitHub 上的开源项目展示</p>
        </div>
        <div className="text-gray-600">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {repositories.length} 个项目
          </span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {repo.name}
                  </h3>
                  {repo.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {repo.description}
                    </p>
                  )}
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  title="在 GitHub 上查看"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              <div className="flex items-center justify-between mb-4">
                {repo.language && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(
                      repo.language
                    )}`}
                  >
                    <Code className="w-3 h-3 mr-1" />
                    {repo.language}
                  </span>
                )}
                
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(repo.updated_at)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center">
                    <GitFork className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-gray-800 transition-colors text-sm"
                >
                  <Github className="w-3 h-3" />
                  <span>查看代码</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {repositories.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">
            显示了所有 {repositories.length} 个项目
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>在 GitHub 上查看更多</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}