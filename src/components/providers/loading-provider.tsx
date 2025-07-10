'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import { useLoadingStore } from '@/hooks/useLoadingStore';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.3,
});

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      NProgress.start();
    };

    const handleComplete = () => {
      setLoading(false);
      NProgress.done();
    };

    // Handle route changes
    handleComplete();

    // Add loading state for slow page loads
    const timer = setTimeout(() => {
      if (document.readyState === 'loading') {
        handleStart();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [pathname, searchParams, setLoading]);

  return <>{children}</>;
};
