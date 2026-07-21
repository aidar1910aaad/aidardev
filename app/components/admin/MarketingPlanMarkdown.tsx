'use client';

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(
        <strong key={key++} className="font-medium text-gray-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={key++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {linkMatch[1]}
          </a>
        );
      }
    } else if (token.startsWith('`')) {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono text-orange-700 dark:text-orange-300"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : [text];
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded-lg bg-gray-700/80 text-white hover:bg-gray-600 transition-colors"
    >
      Копировать
    </button>
  );
}

export default function MarketingPlanMarkdown({ content }: { content: string }) {
  if (!content.trim()) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const code = codeLines.join('\n');
      elements.push(
        <div key={key++} className="relative my-4 group">
          <CopyButton text={code} />
          <pre className="p-4 rounded-xl bg-gray-900 dark:bg-gray-950 text-gray-100 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {code}
          </pre>
        </div>
      );
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={key++}
          className="my-3 pl-4 border-l-4 border-blue-500/60 text-gray-600 dark:text-gray-400 italic"
        >
          {quoteLines.map((q, idx) => (
            <p key={idx}>{renderInline(q)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((r) => !r.match(/^\|[\s:-|]+\|$/));
      if (rows.length) {
        const parseRow = (row: string) =>
          row
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim());
        const header = parseRow(rows[0]);
        const body = rows.slice(1).map(parseRow);
        elements.push(
          <div key={key++} className="my-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/80">
                <tr>
                  {header.map((cell, ci) => (
                    <th
                      key={ci}
                      className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300"
                    >
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].replace(/^[-*] /, ''));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-3 list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === '---') {
      elements.push(<hr key={key++} className="my-6 border-gray-200 dark:border-gray-800" />);
      i++;
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    elements.push(
      <p key={key++} className="my-2 text-gray-600 dark:text-gray-400 leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="marketing-plan-md">{elements}</div>;
}
