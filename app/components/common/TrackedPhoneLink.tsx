'use client';

import type { ComponentProps } from 'react';
import { analyticsEvents } from '../../lib/analytics';

type TrackedPhoneLinkProps = ComponentProps<'a'> & {
  phoneLabel: string;
};

export default function TrackedPhoneLink({
  phoneLabel,
  onClick,
  children,
  ...props
}: TrackedPhoneLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        analyticsEvents.phoneCall(phoneLabel);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
