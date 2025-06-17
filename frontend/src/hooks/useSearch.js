import { useState, useCallback, useEffect } from 'react';

const useSearch = (initialQuery = '', searchFields = [], debounceTime = 300) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceTime]);

  const handleSearch = useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  const resetSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const getSearchResults = useCallback((data) => {
    if (!debouncedQuery) return data;

    const searchTerms = debouncedQuery.toLowerCase().split(' ');

    return data.filter((item) => {
      return searchTerms.every((term) => {
        return searchFields.some((field) => {
          const value = item[field];
          if (!value) return false;
          return value.toString().toLowerCase().includes(term);
        });
      });
    });
  }, [debouncedQuery, searchFields]);

  const getSearchProps = useCallback(() => ({
    query,
    handleSearch,
    resetSearch,
  }), [query, handleSearch, resetSearch]);

  return {
    query,
    debouncedQuery,
    handleSearch,
    resetSearch,
    getSearchResults,
    getSearchProps,
  };
};

export default useSearch; 