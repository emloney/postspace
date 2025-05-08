import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
// import { mockCommunities } from '../../data/mockData';

const Sidebar: React.FC = () => {
  const { authState } = useAuth();
  
  // Show only 5 communities in the sidebar
  // const topCommunities = [...mockCommunities]
  //   .sort((a, b) => b.memberCount - a.memberCount)
  //   .slice(0, 5);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)] w-56 overflow-y-auto scrollbar-hide"
    >
      <div className="space-y-6">
        {/* Main Navigation */}
        <div className="bg-background-secondary rounded-lg p-3">
          <h3 className="font-medium text-xs uppercase text-text-tertiary tracking-wider mb-2 px-2">
            Navigation
          </h3>
          <nav className="space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary transition-colors text-text-secondary hover:text-text-primary"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/explore"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary transition-colors text-text-secondary hover:text-text-primary"
            >
              <Compass size={18} />
              <span>Explore</span>
            </Link>
            <Link
              to="/trending"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary transition-colors text-text-secondary hover:text-text-primary"
            >
              <TrendingUp size={18} />
              <span>Trending</span>
            </Link>
            {authState.isAuthenticated && (
              <>
                {/* <Link
                  to="/saved"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary transition-colors text-text-secondary hover:text-text-primary"
                >
                  <Bookmark size={18} />
                  <span>Saved</span>
                </Link> */}
                {/* <Link
                  to="/communities"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary transition-colors text-text-secondary hover:text-text-primary"
                >
                  <Users size={18} />
                  <span>Communities</span>
                </Link> */}
              </>
            )}
          </nav>
        </div>

        {/* Top Communities */}
        {/* <div className="bg-background-secondary rounded-lg p-3">
          <h3 className="font-medium text-xs uppercase text-text-tertiary tracking-wider mb-2 px-2">
            Top Communities
          </h3>
          <div className="space-y-1">
            {topCommunities.map((community) => (
              <Link
                key={community.id}
                to={`/c/${community.name}`}
                className="flex items-center p-2 rounded-md hover:bg-background-tertiary transition-colors"
              >
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-text-secondary hover:text-text-primary">
                  c/{community.name}
                </span>
              </Link>
            ))}
            <Link
              to="/communities"
              className="flex items-center justify-center p-2 mt-2 text-sm text-accent-primary hover:text-accent-hover transition-colors"
            >
              View All Communities
            </Link>
          </div>
        </div> */}

        {/* Create Post CTA (for logged in users) */}
        {authState.isAuthenticated && (
          <div className="bg-background-secondary rounded-lg p-4 text-center">
            <Zap size={24} className="mx-auto mb-2 text-accent-primary" />
            <h3 className="font-semibold mb-2">Share your thoughts</h3>
            <p className="text-sm text-text-secondary mb-3">
              Create a post and share with the community
            </p>
            <Link
              to="/submit"
              className="block w-full bg-accent-primary hover:bg-accent-hover text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Create Post
            </Link>
          </div>
        )}

        {/* Auth CTA (for logged out users) */}
        {!authState.isAuthenticated && (
          <div className="bg-background-secondary rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">Join PostSpace</h3>
            <p className="text-sm text-text-secondary mb-3">
              Sign up to join the conversation and create posts
            </p>
            <div className="space-y-2">
              <Link
                to="/signup"
                className="block w-full bg-accent-primary hover:bg-accent-hover text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="block w-full bg-transparent border border-border hover:border-text-tertiary text-text-primary font-medium py-2 px-4 rounded-md transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-xs text-text-tertiary px-3">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Help</a>
          </div>
          <p className="mt-2">© 2025 PostSpace</p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;