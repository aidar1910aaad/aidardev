'use client';

import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Wrap in an element carrying responsive display classes if you need to hide it —
 * `.reply-badge` is declared after Tailwind's utilities and would win over them.
 */
export default function ReplyBadge() {
  const { t } = useLanguage();

  return (
    <span className="reply-badge">
      <span className="reply-badge__dot" aria-hidden />
      {t('home.reply')}
    </span>
  );
}
