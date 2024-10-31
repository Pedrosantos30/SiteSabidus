import React from 'react';
import Navbar from './components/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white">
        <div className="container mx-auto">
          <Navbar />
        </div>
      </header>
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;