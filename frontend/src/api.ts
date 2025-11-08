import { Post } from './types';

const API_BASE = '/api';

export async function fetchPosts(parentId: string | null = null): Promise<Post[]> {
  const url = parentId ? `${API_BASE}/posts?parentId=${parentId}` : `${API_BASE}/posts`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

export async function fetchPostById(id: string): Promise<Post> {
  const response = await fetch(`${API_BASE}/posts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
}
