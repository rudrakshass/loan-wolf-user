'use client';

import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This ensures client-side interactions are properly handled
    return () => {
      // Cleanup any subscriptions/intervals here
    };
  }, []);

  return <>{children}</>;
}
