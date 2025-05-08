import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Link as LinkIcon, VideoIcon, Code, ChevronDown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
//import { mockCommunities } from '../data/mockData';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePost();
  const { authState } = useAuth();
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    communityId: '',
    imageUrl: '',
    link: '',
  });
  //const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  
  // Redirect if not authenticated
  if (!authState.isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // const handleCommunitySelect = (communityId: string) => {
  //   setFormData({ ...formData, communityId });
  //   setCommunityDropdownOpen(false);
  // };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalContent = formData.content;
    let finalImageUrl = undefined;
    
    // Handle different post types
    if (postType === 'image' && formData.imageUrl) {
      finalImageUrl = formData.imageUrl;
    } else if (postType === 'link' && formData.link) {
      finalContent = `${formData.content}\n\n${formData.link}`;
    }
    
    createPost({
      title: formData.title,
      content: finalContent,
      authorId: authState.user?.id || '',
      communityId: formData.communityId,
      imageUrl: finalImageUrl,
    });
    
    navigate('/');
  };
  
  //const selectedCommunity = mockCommunities.find(c => c.id === formData.communityId);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create a Post</h1>
        
        <div className="bg-background-secondary rounded-lg p-4 mb-6">
          {/* Community selector */}
          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">Choose a community</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
                className="w-full flex items-center justify-between bg-background-primary border border-border rounded-md p-3 text-left focus:outline-none focus:ring-1 focus:ring-accent-primary"
              >
                {selectedCommunity ? (
                  <div className="flex items-center">
                    <img 
                      src={selectedCommunity.avatar} 
                      alt={selectedCommunity.name} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>c/{selectedCommunity.name}</span>
                  </div>
                ) : (
                  <span className="text-text-tertiary">Select a community</span>
                )}
                <ChevronDown size={18} />
              </button>
              
              {communityDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-background-primary border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {mockCommunities.map(community => (
                      <button
                        key={community.id}
                        onClick={() => handleCommunitySelect(community.id)}
                        className="flex items-center w-full p-2 text-left hover:bg-background-tertiary rounded-md"
                      >
                        <img 
                          src={community.avatar} 
                          alt={community.name} 
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <div>
                          <div>c/{community.name}</div>
                          <div className="text-xs text-text-tertiary">{community.memberCount.toLocaleString()} members</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div> */}
          
          {/* Post type tabs */}
          <div className="flex border-b border-border mb-4">
            <button
              type="button"
              onClick={() => setPostType('text')}
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
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
              className={`px-4 py-2 font-medium text-sm focus:outline-none flex items-center ${
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
              className={`px-4 py-2 font-medium text-sm focus:outline-none flex items-center ${
                postType === 'link'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <LinkIcon size={16} className="mr-1" /> Link
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Title field */}
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full bg-background-primary border border-border rounded-md p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                required
              />
            </div>
            
            {/* Content field based on post type */}
            {postType === 'text' && (
              <div className="mb-4">
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Text (optional)"
                  className="w-full bg-background-primary border border-border rounded-md p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                  rows={8}
                />
              </div>
            )}
            
            {postType === 'image' && (
              <div className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-background-primary border border-border rounded-md p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Add a description (optional)"
                    className="w-full bg-background-primary border border-border rounded-md p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                    rows={4}
                  />
                </div>
                
                {formData.imageUrl && (
                  <div className="mt-2 p-2 border border-border rounded-md">
                    <p className="text-sm text-text-secondary mb-2">Image preview:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="max-h-64 rounded-md mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {postType === 'link' && (
              <div className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Link URL</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full bg-background-primary border border-border rounded-md p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Add text (optional)"
                    className="w-full bg-background-primary border border-border rounded-md p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                    rows={4}
                  />
                </div>
              </div>
            )}
            
            {/* Submit buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title || (postType === 'image' && !formData.imageUrl) || (postType === 'link' && !formData.link)}
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