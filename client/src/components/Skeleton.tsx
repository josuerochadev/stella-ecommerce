import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = false,
  animate = true,
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = animate ? 'skeleton-shimmer' : '';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses} ${roundedClasses} ${className}`}
      style={style}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showAction?: boolean;
  className?: string;
}> = ({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showAction = true,
  className = ''
}) => {
  return (
    <div className={`bg-secondary p-4 rounded-lg shadow-lg ${className}`}>
      {showImage && (
        <Skeleton height="12rem" className="mb-4" rounded />
      )}
      <div className="space-y-3">
        {showTitle && (
          <Skeleton height="1.25rem" width="80%" />
        )}
        {showDescription && (
          <SkeletonText lines={2} />
        )}
        <div className="flex justify-between items-center mt-4">
          <Skeleton height="1.5rem" width="4rem" />
          {showAction && (
            <Skeleton height="2.5rem" width="6rem" rounded />
          )}
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{
  count?: number;
  columns?: number;
  className?: string;
}> = ({ count = 6, columns = 3, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonProfile: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-secondary p-6 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton width={80} height={80} rounded />
        <div className="space-y-2">
          <Skeleton height="1.5rem" width="12rem" />
          <Skeleton height="1rem" width="8rem" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton height="2.5rem" />
        <Skeleton height="2.5rem" />
        <Skeleton height="2.5rem" />
        <div className="flex space-x-4 mt-6">
          <Skeleton height="2.5rem" width="6rem" rounded />
          <Skeleton height="2.5rem" width="6rem" rounded />
        </div>
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{
  count?: number;
  showAvatar?: boolean;
  className?: string;
}> = ({ count = 5, showAvatar = true, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
          {showAvatar && (
            <Skeleton width={48} height={48} rounded />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton height="1.25rem" width="60%" />
            <Skeleton height="1rem" width="40%" />
          </div>
          <Skeleton height="2rem" width="4rem" rounded />
        </div>
      ))}
    </div>
  );
};