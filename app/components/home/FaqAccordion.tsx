'use client';

import { useState } from 'react';
import { analyticsEvents } from '../../lib/analytics';
import { PlusMinus } from '../brand/icons';

interface FaqAccordionProps {
  items: Array<{ question: string; answer: string }>;
  /** Сколько вопросов видно до «Показать все». */
  initialCount: number;
  showAllLabel: string;
  hideAllLabel: string;
}

/** Ответы всегда в HTML (скрыты атрибутом hidden) — их видят поисковики и разметка FAQPage совпадает со страницей. */
export default function FaqAccordion({ items, initialCount, showAllLabel, hideAllLabel }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <ul id="faq-list" className="flex flex-col gap-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-question-${index}`;
          const panelId = `faq-answer-${index}`;
          return (
            <li
              key={item.question}
              hidden={!showAll && index >= initialCount}
              className={`rounded-[20px] bg-white transition-shadow ${isOpen ? 'shadow-[0_4px_14px_rgba(27,31,59,0.06)]' : ''}`}
            >
              <h3 className="text-[17px] tracking-[-0.01em] lg:text-[19px]">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    if (!isOpen) analyticsEvents.faqExpand(item.question);
                    setOpenIndex(isOpen ? null : index);
                  }}
                  className="flex w-full items-center justify-between gap-4 px-5 py-[18px] text-left text-[#1b1f3b] hover:text-[#b4232c] lg:px-7 lg:py-[22px]"
                >
                  <span>{item.question}</span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
                      isOpen ? 'bg-[#b4232c] text-white' : 'bg-[#ffefe3] text-[#1b1f3b]'
                    }`}
                  >
                    <PlusMinus open={isOpen} />
                  </span>
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="-mt-1 px-5 pb-5 lg:px-7 lg:pb-6">
                <p className="text-[15px] leading-[1.6] text-[#464a66] lg:text-base">{item.answer}</p>
              </div>
            </li>
          );
        })}
      </ul>
      {items.length > initialCount && (
        <button
          type="button"
          aria-expanded={showAll}
          aria-controls="faq-list"
          onClick={() => {
            setShowAll(!showAll);
            if (showAll && openIndex !== null && openIndex >= initialCount) setOpenIndex(null);
          }}
          className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[14px] border-2 border-[#1b1f3b] px-6 text-[15px] font-bold text-[#1b1f3b] transition-colors hover:bg-[#1b1f3b] hover:text-white sm:w-auto"
        >
          {showAll ? hideAllLabel : showAllLabel}
        </button>
      )}
    </div>
  );
}
