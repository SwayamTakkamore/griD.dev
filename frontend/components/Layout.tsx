import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gh-canvas-default">
      <Navbar />
      <main>
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2328',
            color: '#e6edf3',
            border: '1px solid #30363d',
          },
          success: {
            iconTheme: {
              primary: '#1f883d',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#cf222e',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
