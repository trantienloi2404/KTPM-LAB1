import { useEffect, useCallback } from 'react';

const useKeyboardShortcut = (key, callback, options = {}) => {
  const {
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    metaKey = false,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      const isKeyPressed = event.key.toLowerCase() === key.toLowerCase();
      const isCtrlPressed = event.ctrlKey === ctrlKey;
      const isAltPressed = event.altKey === altKey;
      const isShiftPressed = event.shiftKey === shiftKey;
      const isMetaPressed = event.metaKey === metaKey;

      if (isKeyPressed && isCtrlPressed && isAltPressed && isShiftPressed && isMetaPressed) {
        event.preventDefault();
        callback(event);
      }
    },
    [key, callback, ctrlKey, altKey, shiftKey, metaKey, enabled]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);
};

export default useKeyboardShortcut; 