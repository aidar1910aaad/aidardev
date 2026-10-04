'use client';

import { useId, useState } from 'react';
import { analyticsEvents } from '../../lib/analytics';

interface MoreTextProps {
  text: string;
  /** Название карточки — для события аналитики. */
  label: string;
  moreLabel: string;
  lessLabel: string;
}

/** Подробный текст карточки: уже в HTML (его видят поисковики), открывается по кнопке. */
export default function MoreText({ text, label, moreLabel, lessLabel }: MoreTextProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="mt-auto pt-1">
      <div id={id} hidden={!open} className="mb-3 border-t border-[#efe3d5] pt-3 text-sm leading-[1.6] text-[#464a66]">
        {text}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (!open) analyticsEvents.serviceExpand(label);
          setOpen(!open);
        }}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#b4232c] hover:text-[#8f1b23]"
      >
        {open ? lessLabel : moreLabel}
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
