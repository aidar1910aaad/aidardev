'use client';

import { useEffect, useMemo } from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
  /**
   * Must be unique per schema on the page, otherwise schemas overwrite each other.
   * When omitted, a stable id is derived from the schema @type and its content.
   */
  id?: string;
}

// Короткий стабильный хеш (djb2) — чтобы у разных схем одного @type были разные id.
function hashString(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function getStructuredDataId(data: Record<string, unknown>, json = JSON.stringify(data)): string {
  const rawType = data['@type'];
  const type = (typeof rawType === 'string' ? rawType : 'schema').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `ld-${type}-${hashString(json)}`;
}

export default function StructuredData({ data, id }: StructuredDataProps) {
  const json = useMemo(() => JSON.stringify(data), [data]);
  const scriptId = id ?? getStructuredDataId(data, json);

  useEffect(() => {
    const oldScript = document.getElementById(scriptId);
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = json;
    script.id = scriptId;
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [json, scriptId]);

  return null;
}
