import { useState, useEffect } from 'react';

export type OS = 'Windows' | 'Mac' | 'ChromeOS' | 'Other';

export function useOS(): OS {
  const [os, setOs] = useState<OS>('Windows'); // Default to Windows

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Mac") !== -1) {
      setOs('Mac');
    } else if (userAgent.indexOf("CrOS") !== -1) {
      setOs('ChromeOS');
    } else if (userAgent.indexOf("Win") !== -1) {
      setOs('Windows');
    } else {
      setOs('Other'); // Linux, etc.
    }
  }, []);

  return os;
}