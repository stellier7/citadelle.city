import { useState, useEffect } from 'react';

const getSliceCount = () => {
  if (typeof window === 'undefined') {
    // Default for server-side rendering
    return 3; 
  }
  // These breakpoints should match tailwind's md and lg
  if (window.innerWidth >= 1024) { // lg
    return 3;
  }
  if (window.innerWidth >= 768) { // md
    return 2;
  }
  // Default for small screens
  return 1; 
};

export const useResponsiveSlice = () => {
  const [sliceCount, setSliceCount] = useState(getSliceCount());

  useEffect(() => {
    const handleResize = () => {
      setSliceCount(getSliceCount());
    };

    window.addEventListener('resize', handleResize);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return sliceCount;
}; 