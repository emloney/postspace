// src/context/PostContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Post, Comment } from '../types';
import { mockPosts, mockComments, mockUsers } from '../data/mockData';
import { useAuth } from './AuthContext';

// A Comment enriched with the display name & avatar we'll actually render
type StoredComment = Comment & {
  username: string;
  avatar: string;
};

interface PostContextProps {
  posts: Post[];
  loading: boolean;

  createPost(
    data: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentCount'>
    & {username: string; avatar: string}
  ): void;

  upvotePost(postId: string): void;
  downvotePost(postId: string): void;

  addComment(data: {
    postId: string;
    authorId: string;
    content: string;
    username: string;
    avatar: string;
  }): void;

  getPostById(id: string): Post | undefined;
  getCommentsByPostId(postId: string): StoredComment[];

  /** All users’ votes: votes[userId][postId] = 'up' | 'down' */
  votes: Record<string, Record<string, 'up' | 'down'>>;

  /** The current user’s own votes (or empty) */
  userVotes: Record<string, 'up' | 'down'>;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authState } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [rawComments, setRawComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState<Record<string, Record<string, 'up' | 'down'>>>({});
  const [loading, setLoading] = useState(true);

  // fallback avatar generator
  const makeAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

  // On mount, pull everything from localStorage (or use mock)
  useEffect(() => {
    const sp = localStorage.getItem('postspace_posts');
    if (sp) {
      setPosts(JSON.parse(sp));
    } else {
      // ENRICH each mockPost with its mockUser’s username+avatar
      const enriched = mockPosts.map(p => {
        const u = mockUsers.find(u => u.id === p.authorId)!;
        return { 
          ...p, 
          username: u.username, 
          avatar:   u.avatar 
        };
      });
      setPosts(enriched);
      localStorage.setItem('postspace_posts', JSON.stringify(enriched));
    }
    

    const sc = localStorage.getItem('postspace_comments');
    if (sc) setRawComments(JSON.parse(sc));
    else {
      setRawComments(mockComments);
      localStorage.setItem('postspace_comments', JSON.stringify(mockComments));
    }

    const sv = localStorage.getItem('postspace_votes');
    if (sv) setVotes(JSON.parse(sv) as Record<string, Record<string, 'up' | 'down'>>);

    setLoading(false);
  }, []);

  // Persist votes map
  const saveVotes = (next: typeof votes) => {
    setVotes(next);
    localStorage.setItem('postspace_votes', JSON.stringify(next));
  };

  // Create
  const createPost = (data: any & {avatar: string}) => {
    const me = authState.user!;
const newPost: Post = {
  ...data,
  id: `post-${Date.now()}`,
  createdAt: new Date().toISOString(),
  upvotes: 0,
  downvotes: 0,
  commentCount: 0,

  // ← HERE WE ADD:
  username: me.username,
  avatar:   me.avatar,
};

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('postspace_posts', JSON.stringify(updated));
  };

  // Comment
  const addComment = (data: any) => {
    const newC: Comment = {
      ...data,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };
    const updatedComments = [...rawComments, newC];
    setRawComments(updatedComments);
    localStorage.setItem('postspace_comments', JSON.stringify(updatedComments));

    // bump post’s commentCount
    const updatedPosts = posts.map(p =>
      p.id === data.postId ? { ...p, commentCount: p.commentCount + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('postspace_posts', JSON.stringify(updatedPosts));
  };

  // Upvote once per user
  const upvotePost = (postId: string) => {
    if (!authState.isAuthenticated) return;
    const uid = authState.user!.id;
    const userVotes = votes[uid] || {};

    if (userVotes[postId] === 'up') return;

    // bump count
    const updatedPosts = posts.map(p =>
      p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('postspace_posts', JSON.stringify(updatedPosts));

    // record vote
    const nextUV: Record<string, 'up' | 'down'> = {
      ...userVotes,
      [postId]: 'up',
    };
    saveVotes({ ...votes, [uid]: nextUV });
  };

  // Downvote once per user
  const downvotePost = (postId: string) => {
    if (!authState.isAuthenticated) return;
    const uid = authState.user!.id;
    const userVotes = votes[uid] || {};

    if (userVotes[postId] === 'down') return;

    const updatedPosts = posts.map(p =>
      p.id === postId ? { ...p, downvotes: p.downvotes + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('postspace_posts', JSON.stringify(updatedPosts));

    // ***FIX*** record a "down" vote here
    const nextUV: Record<string, 'up' | 'down'> = {
      ...userVotes,
      [postId]: 'down',
    };
    saveVotes({ ...votes, [uid]: nextUV });
  };

  const getPostById = (id: string) => posts.find(p => p.id === id);

  // Enrich comments w/ final username+avatar
  const getCommentsByPostId = (postId: string): StoredComment[] =>
    rawComments
      .filter(c => c.postId === postId)
      .map(c => {
        const mu = mockUsers.find(u => u.id === c.authorId);
        const me = authState.user?.id === c.authorId ? authState.user : null;
        const who = mu || me;
        return {
          ...c,
          username: who?.username ?? c.username ?? 'unknown',
          avatar: who?.avatar ?? c.avatar ?? makeAvatar(who?.username || c.authorId),
        };
      });

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        createPost,
        upvotePost,
        downvotePost,
        addComment,
        getPostById,
        getCommentsByPostId,
        votes,
        userVotes: authState.user ? votes[authState.user.id] || {} : {},
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error('usePost must be within PostProvider');
  return ctx;
};
