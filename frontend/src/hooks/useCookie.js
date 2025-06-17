import { useState, useEffect } from 'react';

const useCookie = (key, initialValue, options = {}) => {
  const {
    expires = 7, // days
    path = '/',
    domain = '',
    secure = false,
    sameSite = 'Lax',
  } = options;

  const [cookieValue, setCookieValue] = useState(() => {
    try {
      const cookies = document.cookie.split(';');
      const cookie = cookies.find((c) => c.trim().startsWith(`${key}=`));
      return cookie ? decodeURIComponent(cookie.split('=')[1]) : initialValue;
    } catch (error) {
      console.error('Error reading cookie:', error);
      return initialValue;
    }
  });

  const setCookie = (value) => {
    try {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      const expiresStr = `expires=${date.toUTCString()}`;
      const pathStr = `path=${path}`;
      const domainStr = domain ? `domain=${domain}` : '';
      const secureStr = secure ? 'secure' : '';
      const sameSiteStr = `SameSite=${sameSite}`;

      const cookieString = [
        `${key}=${encodeURIComponent(value)}`,
        expiresStr,
        pathStr,
        domainStr,
        secureStr,
        sameSiteStr,
      ]
        .filter(Boolean)
        .join('; ');

      document.cookie = cookieString;
      setCookieValue(value);
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  };

  const removeCookie = () => {
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      setCookieValue(initialValue);
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  };

  return [cookieValue, setCookie, removeCookie];
};

export default useCookie; 