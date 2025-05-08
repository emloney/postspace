import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Zap, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, login, signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const isLogin = location.pathname === '/login';
  const pageTitle = isLogin ? 'Log In' : 'Sign Up';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await signup(formData.username, formData.email, formData.password);
      }
      
      // Redirect after successful auth
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Zap size={40} className="text-accent-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
          {pageTitle}
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            to={isLogin ? '/signup' : '/login'}
            className="font-medium text-accent-primary hover:text-accent-hover"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-background-secondary py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-primary">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-text-tertiary" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-background-primary border-border focus:ring-accent-primary focus:border-accent-primary block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md text-text-primary"
                  placeholder="your_username"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-text-tertiary" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background-primary border-border focus:ring-accent-primary focus:border-accent-primary block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md text-text-primary"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-tertiary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-background-primary border-border focus:ring-accent-primary focus:border-accent-primary block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-md text-text-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a href="#" className="font-medium text-accent-primary hover:text-accent-hover">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={authState.isLoading}
                className="group"
              >
                <span className="flex items-center">
                  {pageTitle}
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </form>

          {authState.error && (
            <div className="mt-4 p-3 bg-error/10 border border-error/30 rounded-md text-error text-sm">
              {authState.error}
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-secondary text-text-tertiary">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm bg-background-primary text-sm font-medium text-text-primary hover:bg-background-tertiary"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.0003 2C6.47631 2 2.00031 6.476 2.00031 12C2.00031 16.486 4.79531 20.253 8.73031 21.604C9.23031 21.698 9.40031 21.394 9.40031 21.13C9.40031 20.893 9.39331 20.142 9.39031 19.271C6.73031 19.88 6.13731 17.891 6.13731 17.891C5.68431 16.745 5.02931 16.441 5.02931 16.441C4.12131 15.804 5.09731 15.816 5.09731 15.816C6.10131 15.886 6.63031 16.861 6.63031 16.861C7.52231 18.422 8.97031 17.938 9.42031 17.681C9.51231 17.027 9.77131 16.543 10.0613 16.287C7.88631 16.028 5.61731 15.165 5.61731 11.306C5.61731 10.166 6.00931 9.235 6.65031 8.507C6.54631 8.255 6.20331 7.223 6.74731 5.923C6.74731 5.923 7.58631 5.655 9.37831 6.876C10.2178 6.65104 11.0857 6.53751 11.9583 6.539C12.8343 6.539 13.7143 6.654 14.5383 6.876C16.3283 5.655 17.1663 5.923 17.1663 5.923C17.7113 7.223 17.3683 8.255 17.2643 8.507C17.9073 9.235 18.2953 10.166 18.2953 11.306C18.2953 15.174 16.0213 16.025 13.8393 16.279C14.1963 16.595 14.5143 17.221 14.5143 18.175C14.5143 19.551 14.5033 20.801 14.5033 21.13C14.5033 21.396 14.6703 21.703 15.1793 21.602C19.1083 20.248 21.9003 16.484 21.9003 12C21.9003 6.476 17.4243 2 12.0003 2Z"></path>
                </svg>
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm bg-background-primary text-sm font-medium text-text-primary hover:bg-background-tertiary"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.5933 10.9778H12.3435V13.9245H17.5233C17.5233 15.0172 16.7523 16.5611 15.171 17.5122C14.2142 18.1055 12.9749 18.4593 12.31 18.4593C10.1044 18.4593 8.70393 17.4429 8.23842 16.9686C7.13268 15.8593 6.58065 14.2624 6.58065 12.5239C6.58065 10.7323 7.45091 9.03764 8.23842 8.07943C9.17777 7.1335 10.5015 6.58845 12.31 6.58845L12.3123 6.59073C13.3778 6.59073 14.9071 7.08838 15.7963 8.07943L17.9565 5.96356C17.0382 5.18923 15.0617 4 12.3123 4C9.10629 4 6.88419 5.3327 5.56716 6.99568C3.9968 8.95846 3.55469 11.3446 3.55469 12.5239C3.55469 14.4298 4.17831 16.4216 5.56948 17.91C6.90963 19.3438 8.80335 20.1329 11.3778 20.1329C13.6206 20.1329 15.4044 19.2599 16.712 18C18.1413 16.5839 18.8934 14.4685 18.8934 12.7231C18.8934 11.9556 18.849 11.4272 18.8026 11.0112C18.8026 10.9975 18.5838 10.9778 18.5838 10.9778H21.5933Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;