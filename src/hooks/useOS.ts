import { useState, useEffect } from 'react';

export function useOS() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = window.navigator.platform || window.navigator.userAgent;
    if (platform.toUpperCase().indexOf('MAC') >= 0) {
      setIsMac(true);
    }
  }, []);

  return { isMac };
}