'use client';

import { useState, type ReactNode } from 'react';
import { analyticsEvents } from '../../lib/analytics';
import { ArrowRight } from '../brand/icons';

interface ShowMoreProps {
  id: string;
  moreLabel: string;
  lessLabel: string;
  children: ReactNode;
}

/** Скрытый до клика блок: содержимое уже в HTML (видно поисковикам), картинки грузятся только при раскрытии. */
export default function ShowMore({ id, moreLabel, lessLabel, children }: ShowMoreProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          analyticsEvents.projectsShowAllToggle(open ? 'hide' : 'show');
          setOpen(!open);
        }}
        className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border-2 border-[#ffd166] px-[22px] text-base font-bold text-[#ffd166] transition-colors hover:bg-[#ffd166] hover:text-[#1b1f3b] sm:w-auto lg:mt-8"
      >
        {open ? lessLabel : moreLabel}
        <ArrowRight className={`h-[18px] w-[18px] transition-transform ${open ? '-rotate-90' : 'rotate-90'}`} />
      </button>
    </>
  );
}
