'use client';

import { useLoadingStore } from '@/hooks/useLoadingStore';
import { cn } from '@/lib/utils';

export const LoadingOverlay = () => {
  const { isLoading } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-all duration-300',
        isLoading ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center space-y-4">
          {/* Loading Spinner */}
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20">
              <div className="absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Loading...</p>
            <p className="text-sm text-gray-600">
              Please wait while we load the page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
