'use client';

import { useEffect } from 'react';

export const AosInitializer: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('aos').then((AOS) => {
        AOS.default.init({
          duration: 800,
          easing: 'ease-out-cubic',
          once: true,
          offset: 50,
        });
        AOS.default.refresh();
      });
    }
  }, []);

  return null;
};
