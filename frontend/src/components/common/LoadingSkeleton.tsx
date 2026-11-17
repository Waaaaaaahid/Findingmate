import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number; type?: 'card' | 'list' }> = ({
  count = 6,
  type = 'card',
}) => {
  return (
    <div
      className={
        type === 'card'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#E8EAE6] p-4 space-y-3 animate-pulse shadow-sm"
        >
          <div className="w-full h-44 bg-[#E5EEE8]/70 rounded-xl" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5EEE8]" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-[#E5EEE8] rounded w-2/3" />
              <div className="h-3 bg-[#E5EEE8]/60 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-[#E5EEE8]/60 rounded w-full" />
            <div className="h-3 bg-[#E5EEE8]/60 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};
