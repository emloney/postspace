// src/api/index.ts
const BASE = 'http://localhost:5000/api';

export const getMe = () => request('/me');


async function request(path: string, body?: unknown) {
  return fetch(`${BASE}${path}`, {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  }).then(res => res.json());
}

export const signup = (u: string, e: string, p: string) =>
  request('/signup', { username: u, email: e, password: p });

export const signin = (u: string, p: string) =>
  request('/signin', { username: u, password: p });

export const fetchPosts = () => request('/posts');
export const fetchPost   = (id: string) => request(`/posts/${id}`);
export const addComment  = (postId: string, content: string) =>
  request(`/posts/${postId}/comments`, { content });


export const logout = () =>
    fetch(`${BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(r => r.json());
  
    export const createPost = (data: { title: string; body: string }) =>
      request('/posts', data);