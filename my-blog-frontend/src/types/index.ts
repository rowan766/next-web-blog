// src/types/index.ts

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 分类类型
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

// 作者类型
export interface Author {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 文章相关类型
export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  author: Author;
  category: Category;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  status: string;
  featuredImage?: string;
  viewCount: number;
  tags: string[];
}

// API 响应类型
export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 认证相关类型 - 匹配你的后端响应
export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
}

export interface LoginForm {
  usernameOrEmail: string;  // 匹配你的后端 LoginDto
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

// GitHub 仓库类型
export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}