# AnimatedSection - Переиспользуемый компонент для анимации при скролле

## Использование

Просто оберните любой контент в компонент `AnimatedSection`:

```tsx
import AnimatedSection from '../common/AnimatedSection';

export default function MyComponent() {
  return (
    <AnimatedSection animationType="slide-up" delay={100}>
      <h2>Заголовок</h2>
      <p>Контент появится с анимацией при скролле</p>
    </AnimatedSection>
  );
}
```

## Параметры

- `animationType`: `'slide-up' | 'fade-in' | 'slide-left' | 'slide-right'` - тип анимации
- `delay`: число (мс) - задержка перед анимацией
- `threshold`: число (0-1) - процент видимости для запуска (по умолчанию 0.1)
- `triggerOnce`: boolean - запускать только один раз (по умолчанию true)
- `className`: string - дополнительные CSS классы

## Примеры

### Базовое использование
```tsx
<AnimatedSection>
  <div>Контент</div>
</AnimatedSection>
```

### С задержкой
```tsx
<AnimatedSection delay={200}>
  <div>Появится через 200ms</div>
</AnimatedSection>
```

### Разные типы анимаций
```tsx
<AnimatedSection animationType="slide-left">
  <div>Слева направо</div>
</AnimatedSection>

<AnimatedSection animationType="fade-in">
  <div>Просто появление</div>
</AnimatedSection>
```

### Stagger эффект для списков
```tsx
{items.map((item, index) => (
  <AnimatedSection key={item.id} delay={index * 100}>
    <div>{item.title}</div>
  </AnimatedSection>
))}
```







