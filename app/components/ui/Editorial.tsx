import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export function SectionLabel({
  index,
  children,
  className = '',
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#68675f] ${className}`}>
      {index && <span className="font-mono text-[#2446e8]">{index}</span>}
      <span>{children}</span>
    </div>
  );
}

export function ArrowLink({
  children,
  className = '',
  ...props
}: ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      className={`group inline-flex min-h-11 items-center gap-3 border-b-2 border-[#11110f] text-sm font-bold transition-colors hover:border-[#2446e8] hover:text-[#2446e8] ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
    </Link>
  );
}

export function PrimaryLink({
  children,
  className = '',
  ...props
}: ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center bg-[#2446e8] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1836c7] ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
