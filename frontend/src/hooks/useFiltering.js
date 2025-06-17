import { useState, useCallback } from 'react';

const useFiltering = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const getFilteredData = useCallback((data) => {
    return data.filter((item) => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        if (typeof value === 'string') {
          return item[field]?.toLowerCase().includes(value.toLowerCase());
        }
        if (Array.isArray(value)) {
          return value.includes(item[field]);
        }
        return item[field] === value;
      });
    });
  }, [filters]);

  const getFilteringProps = useCallback(() => ({
    filters,
    handleFilterChange,
    handleFilterReset,
  }), [filters, handleFilterChange, handleFilterReset]);

  return {
    filters,
    handleFilterChange,
    handleFilterReset,
    getFilteredData,
    getFilteringProps,
  };
};

export default useFiltering; 