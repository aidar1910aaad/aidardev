'use client';

import type { ComponentProps } from 'react';
import { analyticsEvents } from '../../lib/analytics';
import { PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

type TrackedWhatsAppLinkProps = ComponentProps<'a'> & {
  source: string;
};

export default function TrackedWhatsAppLink({
  source,
  onClick,
  children,
  target = '_blank',
  rel = 'noopener noreferrer',
  ...props
}: TrackedWhatsAppLinkProps) {
  return (
    <a
      {...props}
      target={target}
      rel={rel}
      onClick={(event) => {
        analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, source);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
