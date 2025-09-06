
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-5 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-yellow-300 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
                Nano Banana <span className="text-gray-400">Photo Editor</span>
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
