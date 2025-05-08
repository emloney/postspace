import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Bell, MessageSquare, Plus, LogOut, User, Home, TrendingUp as Trending, Zap, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const seed = authState.user?.username || Date.now().toString();
const avatarUrl =
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background-primary/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Zap size={24} className="text-accent-primary mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              PostSpace
            </span>
          </Link>

          {/* Search bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search PostSpace..."
                className="w-full bg-background-secondary border border-border rounded-full py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <>
                <button className="p-2 rounded-full hover:bg-background-secondary transition-colors">
                  <Plus size={20} className="text-text-secondary" />
                </button>
                <button className="p-2 rounded-full hover:bg-background-secondary transition-colors">
                  <Bell size={20} className="text-text-secondary" />
                </button>
                <button className="p-2 rounded-full hover:bg-background-secondary transition-colors">
                  <MessageSquare size={20} className="text-text-secondary" />
                </button>
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 hover:bg-background-secondary p-1 px-2 rounded-full transition-colors"
                  >
                    <Avatar
  src={avatarUrl}                    // your SVG URL
  alt={authState.user?.username || 'User avatar'}       // use username for alt text
  size="sm"
/>
<span className="text-sm font-medium">
  {authState.user?.username /* show their username here */}
</span>

                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-background-secondary rounded-md shadow-lg border border-border overflow-hidden"
                      >
                        <div className="p-2">
                          <Link
                            to={`/u/${authState.user?.username}`}
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User size={16} />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings size={16} />
                            <span>Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center space-x-2 p-2 rounded-md hover:bg-background-tertiary text-error transition-colors"
                          >
                            <LogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-text-secondary hover:bg-background-secondary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background-secondary border-t border-border"
          >
            <div className="container mx-auto px-4 py-2">
              {/* Mobile search */}
              <div className="relative my-4">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search PostSpace..."
                  className="w-full bg-background-primary border border-border rounded-full py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                />
              </div>

              {/* Navigation links */}
              <nav className="space-y-1 pb-3">
                <Link
                  to="/"
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-background-tertiary transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                <Link
                  to="/trending"
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-background-tertiary transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <Trending size={20} />
                  <span>Trending</span>
                </Link>
                {authState.isAuthenticated ? (
                  <>
                    <Link
                      to="/notifications"
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-background-tertiary transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <Bell size={20} />
                      <span>Notifications</span>
                    </Link>
                    <Link
                      to="/messages"
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-background-tertiary transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <MessageSquare size={20} />
                      <span>Messages</span>
                    </Link>
                    <Link
                      to={`/u/${authState.user?.username}`}
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-background-tertiary transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/submit"
                      className="flex items-center space-x-2 p-3 rounded-md bg-accent-primary text-white hover:bg-accent-hover transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <Plus size={20} />
                      <span>Create Post</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="flex w-full items-center space-x-2 p-3 rounded-md hover:bg-background-tertiary text-error transition-colors"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate('/login');
                        toggleMobileMenu();
                      }}
                      fullWidth
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/signup');
                        toggleMobileMenu();
                      }}
                      fullWidth
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;