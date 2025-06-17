import { useState, useCallback } from 'react';

const useDragAndDrop = (onDrop) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = useCallback((e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    setDraggedItem(item);
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedItem(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e, targetItem) => {
      e.preventDefault();
      setIsDragging(false);
      setDraggedItem(null);

      try {
        const droppedItem = JSON.parse(e.dataTransfer.getData('text/plain'));
        onDrop(droppedItem, targetItem);
      } catch (error) {
        console.error('Error parsing dropped item:', error);
      }
    },
    [onDrop]
  );

  return {
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};

export default useDragAndDrop; 