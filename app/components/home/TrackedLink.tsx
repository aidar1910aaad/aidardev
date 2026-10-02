'use client';

import type { ReactNode } from 'react';
import { analyticsEvents } from '../../lib/analytics';
import { PRIMARY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

/** Что отправить в аналитику при клике. Обычные данные — их можно передать из серверного компонента. */
export type TrackEvent =
  | { type: 'whatsapp'; source: string }
  | { type: 'calculate'; source: string }
  | { type: 'project'; name: string; url: string }
  | { type: 'scroll'; id: string }
  | { type: 'external'; label: string };

function track(event: TrackEvent) {
  switch (event.type) {
    case 'whatsapp':
      analyticsEvents.whatsappClick(PRIMARY_WHATSAPP_NUMBER, event.source);
      break;
    case 'calculate':
      analyticsEvents.calculatePriceClick(event.source);
      break;
    case 'project':
      analyticsEvents.projectLinkClick(event.name, event.url);
      break;
    case 'scroll':
      analyticsEvents.scrollToSection(event.id);
      break;
    case 'external':
      analyticsEvents.navigationClick(event.label);
      break;
  }
}

interface TrackedLinkProps {
  href: string;
  event: TrackEvent;
  className?: string;
  children: ReactNode;
  external?: boolean;
  'aria-label'?: string;
}

/** Ссылка для серверных разделов главной: обычный <a> плюс событие аналитики по клику. */
export default function TrackedLink({ href, event, className, children, external, ...rest }: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
