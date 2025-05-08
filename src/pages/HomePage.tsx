import React, { useState } from 'react';
import { Compass, TrendingUp, Clock, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import PostCard from '../components/ui/PostCard';
import { usePost } from '../context/PostContext';

type SortOption = 'trending' | 'new' | 'top';

const HomePage: React.FC = () => {
  const { posts, loading } = usePost();
  const [sortOption, setSortOption] = useState<SortOption>('trending');
  
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === 'new') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'top') {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else {
      // trending - combination of recency and votes
      const aScore = (a.upvotes - a.downvotes) * 0.7 + new Date(a.createdAt).getTime() * 0.3;
      const bScore = (b.upvotes - b.downvotes) * 0.7 + new Date(b.createdAt).getTime() * 0.3;
      return bScore - aScore;
    }
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Your PostSpace Feed</h1>
        
        {/* Filter pills */}
        <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
          <button
            onClick={() => setSortOption('trending')}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortOption === 'trending'
                ? 'bg-accent-primary text-white'
                : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            Trending
          </button>
          <button
            onClick={() => setSortOption('new')}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortOption === 'new'
                ? 'bg-accent-primary text-white'
                : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
            }`}
          >
            <Clock size={16} className="mr-2" />
            New
          </button>
          <button
            onClick={() => setSortOption('top')}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortOption === 'top'
                ? 'bg-accent-primary text-white'
                : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
            }`}
          >
            <Medal size={16} className="mr-2" />
            Top
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors bg-background-secondary text-text-secondary hover:bg-background-tertiary`}
          >
            <Compass size={16} className="mr-2" />
            Discover
          </button>
        </div>
        
        {/* Posts */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            [...Array(4)].map((_, index) => (
              <div key={index} className="bg-background-secondary rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-10 w-10 bg-background-tertiary rounded-full"></div>
                  <div className="h-4 bg-background-tertiary rounded w-1/4"></div>
                </div>
                <div className="h-5 bg-background-tertiary rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-background-tertiary rounded w-full"></div>
                  <div className="h-4 bg-background-tertiary rounded w-5/6"></div>
                </div>
              </div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-4"
            >
              {sortedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;