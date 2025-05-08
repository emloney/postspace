// src/pages/CreatePostPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Link as LinkIcon } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePost();
  const { authState } = useAuth();

  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    communityId: '',
    imageUrl: '',   // will hold a data:… string
    link: '',
  });

  // 1️⃣ When a file is picked, read it as a Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is "data:image/png;base64,XXXXX…"
      setFormData(f => ({ ...f, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user) return;

    let finalContent = formData.content;
    let finalImageUrl: string | undefined;

    if (postType === 'image' && formData.imageUrl) {
      finalImageUrl = formData.imageUrl;
    } else if (postType === 'link' && formData.link) {
      finalContent = `${formData.content}\n\n${formData.link}`;
    }

    createPost({
      title:       formData.title,
      content:     finalContent,
      authorId:    authState.user.id,
      username:    authState.user.username,
      avatar:      authState.user.avatar,
      communityId: formData.communityId,
      imageUrl:    finalImageUrl,
    });

    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create a Post</h1>
        <div className="bg-background-secondary rounded-lg p-6">
          {/* tabs */}
          <div className="flex border-b border-border mb-4">
            <button
              type="button"
              onClick={() => setPostType('text')}
              className={`px-4 py-2 text-sm font-medium ${
                postType === 'text'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setPostType('image')}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                postType === 'image'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Image size={16} className="mr-1" /> Image
            </button>
            <button
              type="button"
              onClick={() => setPostType('link')}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                postType === 'link'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <LinkIcon size={16} className="mr-1" /> Link
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-3 border border-border rounded-md bg-background-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              required
            />

            {/* Text post */}
            {postType === 'text' && (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Text (optional)"
                rows={6}
                className="w-full p-3 border border-border rounded-md bg-background-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
            )}

            {/* Image post */}
            {postType === 'image' && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-border rounded-md bg-background-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                  required
                />
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Description (optional)"
                  rows={4}
                  className="w-full p-3 border border-border rounded-md bg-background-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full mt-2 rounded-md max-h-64 object-cover"
                  />
                )}
              </>
            )}

            {/* Link post */}
            {postType === 'link' && (
              <>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Link URL"
                  className="w-full p-3 border border-border rounded-md bg-background-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                  required
                />
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Text (optional)"
                  rows={4}
                  className="w-full p-3 border border-border rounded-md bg-background-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                />
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !formData.title ||
                  (postType === 'image' && !formData.imageUrl) ||
                  (postType === 'link' && !formData.link)
                }
              >
                Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePostPage;
