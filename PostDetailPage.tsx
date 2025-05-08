import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import PostCard from '../components/ui/PostCard';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../utils/userUtils';
import { formatDistanceToNow } from '../utils/dateUtils';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, getCommentsByPostId, addComment } = usePost();
  const { authState } = useAuth();
  const [commentText, setCommentText] = useState('');
  
  const post = getPostById(id || '');
  const comments = getCommentsByPostId(id || '');
  
  if (!post) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="text-text-secondary mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-accent-primary hover:underline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-2" /> Back to home
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.isAuthenticated || !commentText.trim()) {
      return;
    }
    
    addComment({
      content: commentText,
      authorId: authState.user?.id || '',
      postId: post.id,
    });
    
    setCommentText('');
  };

  return (
    <Layout>
      <div>
        <Link to="/" className="flex items-center text-text-secondary hover:text-text-primary mb-4">
          <ArrowLeft size={18} className="mr-2" /> Back to posts
        </Link>
        
        <PostCard post={post} isDetailed />
        
        {/* Comment form */}
        <div className="bg-background-secondary rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-4">Comments</h3>
          
          {authState.isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex space-x-3">
                <Avatar 
                  src={authState.user?.avatar || ''} 
                  alt={authState.user?.displayName || ''} 
                  size="sm" 
                />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-background-primary border border-border rounded-md p-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={!commentText.trim()}
                      size="sm"
                    >
                      <Send size={16} className="mr-2" /> Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-background-tertiary rounded-md p-4 mb-6 text-center">
              <p className="text-text-secondary mb-2">You need to be logged in to comment</p>
              <Link to="/login" className="text-accent-primary hover:underline">
                Log in to comment
              </Link>
            </div>
          )}
          
          {/* Comment list */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-text-tertiary text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => {
                const commentAuthor = getUserById(comment.authorId);
                console.log('comment.authorId:', comment.authorId);
                console.log('author', commentAuthor);
                
                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex space-x-3"
                  >
                    <Avatar 
                      src={commentAuthor?.avatar || ''} 
                      alt={commentAuthor?.displayName || ''} 
                      size="sm" 
                    />
                    <div className="flex-1">
                      <div className="bg-background-tertiary rounded-md p-3">
                        <div className="flex items-center mb-1">
                          <Link 
                            to={`/u/${commentAuthor?.username}`}
                            className="font-medium text-text-primary hover:underline mr-2"
                          >
                            {commentAuthor?.displayName}
                          </Link>
                          <span className="text-xs text-text-tertiary">
                            {formatDistanceToNow(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-text-secondary">{comment.content}</p>
                      </div>
                      <div className="flex items-center mt-1 ml-1 text-xs text-text-tertiary">
                        <button className="hover:text-text-primary">Reply</button>
                        <span className="mx-1">•</span>
                        <button className="hover:text-accent-primary">Upvote</button>
                        <span className="mx-1">•</span>
                        <button className="hover:text-error">Downvote</button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetailPage;