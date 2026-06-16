'use client';

import Link from 'next/link';
import { trackCTAClick } from '@/lib/analytics';

interface TrackedLinkProps {
  href: string;
  label: string;
  location: string;
  campaign?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export default function TrackedLink({ href, label, location, campaign, className, children, onClick }: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    trackCTAClick(label, location, href, campaign);
    if (onClick) onClick(e);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
