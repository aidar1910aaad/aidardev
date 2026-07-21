// Серверный компонент для добавления structured data
// Используется для SEO оптимизации

interface StructuredDataServerProps {
  data: Record<string, any>;
  id?: string;
}

export default function StructuredDataServer({ data, id = 'structured-data' }: StructuredDataServerProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}






