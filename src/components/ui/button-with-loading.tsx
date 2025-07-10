'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { useLoadingStore } from '@/hooks/useLoadingStore';
import { cn } from '@/lib/utils';

interface ButtonWithLoadingProps extends ButtonProps {
  href?: string;
  loadingText?: string;
}

export const ButtonWithLoading = ({
  href,
  children,
  className,
  onClick,
  loadingText = 'Loading...',
  disabled,
  ...props
}: ButtonWithLoadingProps) => {
  const router = useRouter();
  const { isLoading, setLoading } = useLoadingStore();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      e.preventDefault();
      setLoading(true);

      setTimeout(() => {
        router.push(href);
      }, 150);
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      {...props}
      className={cn(className)}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
