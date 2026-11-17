import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border border-[#E8EAE6] my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#E5EEE8] flex items-center justify-center text-[#174C3B] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold font-serif text-[#202522] mb-1">{title}</h3>
      <p className="text-sm text-[#777F79] max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-[#174C3B] hover:bg-[#11392C] rounded-xl shadow-sm transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
