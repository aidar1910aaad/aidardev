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
      // «<» экранируем: заголовки статей приходят из генератора блога, «</script>» в них не должен закрыть тег.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}






