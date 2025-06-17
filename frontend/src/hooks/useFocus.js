import { useState, useRef, useCallback } from 'react';

const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const focusRef = useCallback(
    (node) => {
      if (ref.current) {
        ref.current.removeEventListener('focus', handleFocus);
        ref.current.removeEventListener('blur', handleBlur);
      }

      ref.current = node;

      if (ref.current) {
        ref.current.addEventListener('focus', handleFocus);
        ref.current.addEventListener('blur', handleBlur);
      }
    },
    [handleFocus, handleBlur]
  );

  const focus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const blur = useCallback(() => {
    if (ref.current) {
      ref.current.blur();
    }
  }, []);

  return [focusRef, isFocused, focus, blur];
};

export default useFocus; 