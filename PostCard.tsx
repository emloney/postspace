import React from 'react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { usePost } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { getUserById } from '../../utils/userUtils';
import { getCommunityById } from '../../utils/communityUtils';

interface PostCardProps {
  post: Post;
  isDetailed?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isDetailed = false }) => {
  const { upvotePost, downvotePost } = usePost();
  const { authState } = useAuth();
  
  const author = getUserById(post.authorId);
  const community = getCommunityById(post.communityId);
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    upvotePost(post.id);
  };
  
  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downvotePost(post.id);
  };

  const cardContent = (
    <>
      {/* Community and author info */}
      <div className="flex items-center mb-2 text-sm">
        {community?.avatar && (
          <img 
            src={community.avatar} 
            alt={community.name} 
            className="w-5 h-5 rounded-full mr-2"
          />
        )}
        {/* <Link 
          to={`/c/${community?.name}`}
          className="font-medium text-accent-primary hover:underline mr-2"
          onClick={(e) => e.stopPropagation()}
        >
          c/{community?.name}
        </Link> */}
        {/* <span className="text-text-tertiary mx-1">•</span> */}
        <span className="text-text-tertiary">Posted by</span>
        <Link 
          to={`/u/${author?.username}`}
          className="text-text-secondary hover:underline ml-1"
          onClick={(e) => e.stopPropagation()}
        >
          u/{author?.username}
        </Link>
        <span className="text-text-tertiary mx-1">•</span>
        <span className="text-text-tertiary">{formatDistanceToNow(post.createdAt)}</span>
      </div>
      
      {/* Post title */}
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      
      {/* Post content - truncate if not in detailed view */}
      {isDetailed ? (
        <div className="mb-4 text-text-secondary">{post.content}</div>
      ) : (
        <div className="mb-4 text-text-secondary line-clamp-3">{post.content}</div>
      )}
      
      {/* Post image if available */}
      {post.imageUrl && (
        <div className={`mb-4 ${isDetailed ? 'max-h-96' : 'max-h-72'} overflow-hidden rounded-md`}>
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full object-cover"
          />
        </div>
      )}
      
      {/* Post actions */}
      <div className="flex items-center text-text-tertiary">
        {/* Vote controls */}
        <div className="flex items-center space-x-1 mr-6">
          <button 
            onClick={handleUpvote}
            disabled={!authState.isAuthenticated}
            className="p-1 rounded hover:bg-background-tertiary transition-colors"
          >
            <ArrowBigUp size={18} className="text-text-tertiary hover:text-accent-primary" />
          </button>
          <span className="font-medium">{post.upvotes - post.downvotes}</span>
          <button 
            onClick={handleDownvote}
            disabled={!authState.isAuthenticated}
            className="p-1 rounded hover:bg-background-tertiary transition-colors"
          >
            <ArrowBigDown size={18} className="text-text-tertiary hover:text-error" />
          </button>
        </div>
        
        {/* Comments */}
        <Link 
          to={`/post/${post.id}`}
          className="flex items-center space-x-1 mr-6 hover:bg-background-tertiary p-1 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageSquare size={18} />
          <span>{post.commentCount} Comments</span>
        </Link>
        
        {/* Share */}
        <button className="flex items-center space-x-1 hover:bg-background-tertiary p-1 rounded transition-colors">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </>
  );

  if (isDetailed) {
    return (
      <div className="bg-background-secondary rounded-lg p-4 mb-4">
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="bg-background-secondary rounded-lg p-4 mb-4 hover:border-l-2 hover:border-accent-primary transition-all">
          {cardContent}
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard;