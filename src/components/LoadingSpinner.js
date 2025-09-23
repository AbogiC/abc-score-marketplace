import React from 'react';
import { Music } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="relative">
          <Music className="w-16 h-16 text-indigo-600 mx-auto animate-bounce" />
          <div className="loading-spinner mx-auto mt-4"></div>
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading Sheet Music Marketplace...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;