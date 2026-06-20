import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  const baseClass = "animate-pulse rounded bg-slate-200";

  return (
    <div className={`${baseClass} ${className}`}></div>
  );
};