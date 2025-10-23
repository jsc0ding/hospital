import React from 'react';
import '../../uslublar/components.css';

const SkeletonLoader = ({ type = 'text', width = '100%', height = '1rem', count = 1, className = '' }) => {
  const skeletons = [];
  
  for (let i = 0; i < count; i++) {
    skeletons.push(
      <div 
        key={i}
        className={`skeleton-loader skeleton-${type} ${className}`}
        style={{ width, height }}
      />
    );
  }
  
  return <>{skeletons}</>;
};

export default SkeletonLoader;