import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-[#E5EEE8] flex items-center justify-center text-[#174C3B] mb-2">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold font-serif text-[#174C3B]">404 - Off the Map</h1>
      <p className="text-sm text-[#777F79] max-w-sm">
        The destination or page you are looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#174C3B] text-white text-xs font-semibold hover:bg-[#11392C] transition-colors shadow-sm mt-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};
