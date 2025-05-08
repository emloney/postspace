// src/pages/PostDetailPage.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import { mockUsers } from '../data/mockData';
import { formatDistanceToNow } from '../utils/dateUtils';
import {  Post } from '../types';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { getPostById, getCommentsByPostId, addComment } = usePost();

  // 1️⃣ Load the raw post
  const post: Post | undefined = id ? getPostById(id) : undefined;
  if (!post) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <button onClick={() => navigate('/')} className="text-accent-primary">
            ← Back to home
          </button>
        </div>
      </Layout>
    );
  }

  // 2️⃣ Look up the author (mock or real)
  const author = mockUsers.find(u => u.id === post.authorId);

  const authorAvatar = author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`;

  // comment form state
  const [text, setText] = useState('');
  const comments = getCommentsByPostId(post.id);

  // 3️⃣ When submitting, include username/avatar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.isAuthenticated || !text.trim()) return;
    addComment({
      postId: post.id,
      authorId: authState.user!.id,
      content: text.trim(),
      username: authState.user!.username,
      avatar: authState.user!.avatar,
    });
    setText('');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <Link to="/" className="text-text-secondary flex items-center">
          <ArrowLeft className="mr-2" /> Back to posts
        </Link>

        {/* Post header */}
        <div className="flex items-center space-x-3">
          <Avatar src={authorAvatar} alt={post.username} size="sm" />
          <Link to={`/u/${post.username}`} className="font-medium hover:underline">
            u/{post.username}
          </Link>
          <span className="text-text-tertiary">• {formatDistanceToNow(post.createdAt)} ago</span>
        </div>

        {/* Title & content */}
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="prose">{post.content}</p>

        {/* Image */}
        {post.imageUrl && (
          <div className="my-4">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-md object-cover max-h-96"
            />
          </div>
        )}

        {/* Comments */}
        <div className="bg-background-secondary rounded-lg p-4">
          <h3 className="font-semibold mb-4">Comments</h3>

          {authState.isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-3">
                <Avatar
                  src={authState.user!.avatar}
                  alt={authState.user!.username}
                  size="sm"
                />
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Add a comment…"
                  className="flex-1 bg-background-primary border border-border rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={!text.trim()}>
                  <Send className="mr-2" /> Comment
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <Link to="/login" className="text-accent-primary hover:underline">
                Log in to comment
              </Link>
            </div>
          )}

          <div className="space-y-6 mt-6">
            {comments.length === 0 ? (
              <p className="text-text-tertiary text-center">
                No comments yet—be the first!
              </p>
            ) : (
              comments.map(c => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3"
                >
                  <Avatar src={c.avatar ?? ''} alt={c.username} size="sm" />
                  <div className="flex-1 bg-background-tertiary rounded-md p-3">
                    <div className="flex items-center mb-1 text-sm">
                      <Link
                        to={`/u/${c.username}`}
                        className="font-medium hover:underline mr-2"
                      >
                        u/{c.username}
                      </Link>
                      <span className="text-text-tertiary">
                        {formatDistanceToNow(c.createdAt)} ago
                      </span>
                    </div>
                    <p className="text-text-primary">{c.content}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetailPage;
