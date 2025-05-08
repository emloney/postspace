import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      <Header />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <div className="flex">
            {showSidebar && <Sidebar />}
            <main className={`flex-1 ${showSidebar ? 'lg:ml-6' : ''}`}>
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;