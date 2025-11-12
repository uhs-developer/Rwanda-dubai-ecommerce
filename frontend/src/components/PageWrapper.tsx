import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Common page wrapper with consistent padding
 * Use this for all public pages to ensure consistent spacing
 */
export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}>
      {children}
    </div>
  );
}

