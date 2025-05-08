import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary mt-8 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and social links */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Zap size={24} className="text-accent-primary mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                PostSpace
              </span>
            </div>
            <p className="text-text-secondary text-sm">
              Join the conversation on any topic. Share your ideas with the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-tertiary hover:text-accent-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-text-tertiary hover:text-accent-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-text-tertiary hover:text-accent-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-text-tertiary hover:text-accent-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Product links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><Link to="/" className="hover:text-accent-primary transition-colors">Home</Link></li>
              <li><Link to="/explore" className="hover:text-accent-primary transition-colors">Explore</Link></li>
              <li><Link to="/trending" className="hover:text-accent-primary transition-colors">Trending</Link></li>
              <li><Link to="/communities" className="hover:text-accent-primary transition-colors">Communities</Link></li>
            </ul>
          </div>
          
          {/* Company links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><a href="#" className="hover:text-accent-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Press</a></li>
            </ul>
          </div>
          
          {/* Resources links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><a href="#" className="hover:text-accent-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-tertiary text-sm">
            © 2025 PostSpace. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-text-tertiary">
            <a href="#" className="hover:text-accent-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-accent-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;