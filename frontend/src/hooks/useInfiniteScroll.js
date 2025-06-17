import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (loadMore, hasMore = true, threshold = 100) => {
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setLoading(true);
            loadMore().finally(() => setLoading(false));
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      );
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, loadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    lastElementRef,
    loading,
  };
};

export default useInfiniteScroll; 