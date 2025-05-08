import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Comment } from '../types';
import { mockPosts, mockComments } from '../data/mockData';
import { useAuth } from './AuthContext';

interface PostContextProps {
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentCount'>) => void;
  upvotePost: (postId: string) => void;
  downvotePost: (postId: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'replies'>) => void;
  getPostById: (id: string) => Post | undefined;
  getCommentsByPostId: (postId: string) => Comment[];
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

  useEffect(() => {
    // Load posts from localStorage or use mock data
    const storedPosts = localStorage.getItem('postspace_posts');
    const storedComments = localStorage.getItem('postspace_comments');
    
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(mockPosts);
      localStorage.setItem('postspace_posts', JSON.stringify(mockPosts));
    }
    
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      setComments(mockComments);
      localStorage.setItem('postspace_comments', JSON.stringify(mockComments));
    }
    
    setLoading(false);
  }, []);

  // Create a new post
  const createPost = (postData: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentCount'>) => {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
    };
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('postspace_posts', JSON.stringify(updatedPosts));
  };

  // Add a new comment
  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'replies'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };
    
    // Update comments
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('postspace_comments', JSON.stringify(updatedComments));
    
    // Update post's comment count
    const updatedPosts = posts.map(post => 
      post.id === commentData.postId 
        ? { ...post, commentCount: post.commentCount + 1 }
        : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('postspace_posts', JSON.stringify(updatedPosts));
  };

  // Upvote a post
  const upvotePost = (postId: string) => {
    if (!authState.isAuthenticated) return;
    
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('postspace_posts', JSON.stringify(updatedPosts));
  };

  // Downvote a post
  const downvotePost = (postId: string) => {
    if (!authState.isAuthenticated) return;
    
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('postspace_posts', JSON.stringify(updatedPosts));
  };

  // Get post by ID
  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
  };

  // Get all comments for a post
  const getCommentsByPostId = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };

  return (
    <PostContext.Provider value={{
      posts,
      comments,
      loading,
      createPost,
      upvotePost,
      downvotePost,
      addComment,
      getPostById,
      getCommentsByPostId,
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};