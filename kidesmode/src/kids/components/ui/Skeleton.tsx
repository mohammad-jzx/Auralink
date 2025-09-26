import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', children }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-black/5 shadow-sm">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
};
