'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useLoadingStore } from '@/hooks/useLoadingStore';

interface LinkWithLoadingProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LinkWithLoading = ({
  href,
  children,
  className,
  onClick,
}: LinkWithLoadingProps) => {
  const router = useRouter();
  const { setLoading } = useLoadingStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Start loading
    setLoading(true);

    // Small delay to show the loading state
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};
