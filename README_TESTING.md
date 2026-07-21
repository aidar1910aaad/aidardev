# Руководство по тестированию

## 📋 Обзор

В проекте настроено тестирование с использованием:
- **Jest** - фреймворк для тестирования
- **React Testing Library** - библиотека для тестирования React компонентов
- **@testing-library/jest-dom** - дополнительные матчеры для DOM

## 🚀 Быстрый старт

### Запуск всех тестов
```bash
npm test
```

### Запуск тестов в режиме watch (автоматический перезапуск при изменениях)
```bash
npm run test:watch
```

### Запуск тестов с покрытием кода
```bash
npm run test:coverage
```

## 📁 Структура тестов

Тесты должны находиться рядом с компонентами или в папке `__tests__`:

```
app/
  components/
    landing/
      Hero.tsx
      __tests__/
        Hero.test.tsx
```

Или можно использовать формат `Component.test.tsx` рядом с компонентом:

```
app/
  components/
    landing/
      Hero.tsx
      Hero.test.tsx
```

## ✍️ Написание тестов

### Пример базового теста

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('рендерится без ошибок', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Тестирование компонентов с контекстом

Если компонент использует контекст (LanguageProvider, ThemeProvider), нужно обернуть его:

```typescript
import { LanguageProvider } from '../../../contexts/LanguageContext'

const ComponentWithProvider = () => (
  <LanguageProvider initialLanguage="ru">
    <MyComponent />
  </LanguageProvider>
)

it('работает с провайдером', () => {
  render(<ComponentWithProvider />)
  // тесты...
})
```

### Тестирование событий

```typescript
import userEvent from '@testing-library/user-event'

it('обрабатывает клик', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)
  
  const button = screen.getByRole('button')
  await user.click(button)
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument()
})
```

### Тестирование асинхронных операций

```typescript
it('загружает данные', async () => {
  render(<MyComponent />)
  
  // Ждем появления элемента
  const element = await screen.findByText('Loaded')
  expect(element).toBeInTheDocument()
})
```

## 🎯 Что тестировать

### Приоритет 1 (Критично):
- ✅ Основные компоненты (Hero, Header, Footer)
- ✅ Контексты (LanguageContext, ThemeContext)
- ✅ Утилиты (analytics, helpers)
- ✅ API роуты (если есть)

### Приоритет 2 (Важно):
- ✅ Формы и валидация
- ✅ Навигация
- ✅ Интерактивные компоненты

### Приоритет 3 (Желательно):
- ✅ Стили и классы
- ✅ Анимации
- ✅ Edge cases

## 📊 Покрытие кода

Текущие пороги покрытия:
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

Эти значения можно изменить в `jest.config.js`.

## 🔧 Конфигурация

### jest.config.js
Основная конфигурация Jest с поддержкой Next.js.

### jest.setup.js
Настройки перед запуском тестов:
- Моки для Next.js роутинга
- Моки для window.matchMedia
- Моки для IntersectionObserver

## 🐛 Отладка тестов

### Показать больше информации
```bash
npm test -- --verbose
```

### Запустить конкретный тест
```bash
npm test -- Hero.test.tsx
```

### Запустить тесты с фильтром
```bash
npm test -- -t "рендерится без ошибок"
```

## 📚 Полезные ресурсы

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)

## 💡 Советы

1. **Тестируйте поведение, а не реализацию** - проверяйте, что пользователь видит и может делать
2. **Используйте data-testid только когда необходимо** - предпочитайте role, text, label
3. **Изолируйте тесты** - каждый тест должен быть независимым
4. **Пишите понятные названия** - `it('должен отображать заголовок')` лучше чем `it('test 1')`
5. **Не тестируйте детали реализации** - тестируйте результат, а не как он получен

## ❓ Часто задаваемые вопросы

### Как тестировать компоненты с useRouter?
Используйте мок из `jest.setup.js` - он уже настроен.

### Как тестировать компоненты с изображениями?
Изображения автоматически мокируются через `__mocks__/fileMock.js`.

### Как тестировать компоненты с анимациями?
Анимации можно пропустить или мокировать. В большинстве случаев они не влияют на функциональность.

### Нужно ли тестировать стили?
Обычно нет, но можно проверить наличие классов через `toHaveClass()`.

## 📝 Примеры тестов в проекте

### Тесты компонентов
- `app/components/landing/__tests__/Hero.test.tsx` - тесты Hero секции
- `app/components/landing/__tests__/About.test.tsx` - тесты About секции
- `app/components/landing/__tests__/Projects.test.tsx` - тесты Projects секции
- `app/components/blog/__tests__/BlogFilters.test.tsx` - тесты фильтров блога
- `app/components/common/__tests__/AnimatedSection.test.tsx` - тесты анимированной секции

### Тесты контекстов
- `app/contexts/__tests__/LanguageContext.test.tsx` - тесты языкового контекста

### Тесты утилит
- `app/lib/__tests__/analytics.test.ts` - тесты аналитики
- `app/lib/__tests__/schemas.test.ts` - тесты structured data схем

## 🎓 Как начать писать тесты (для начинающих)

### Шаг 1: Понять, что тестировать
Тестируйте **поведение**, а не реализацию:
- ✅ "Пользователь видит заголовок" - хорошо
- ❌ "Компонент использует useState" - плохо

### Шаг 2: Базовый шаблон теста
```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('отображает заголовок', () => {
    render(<MyComponent />)
    expect(screen.getByText('Заголовок')).toBeInTheDocument()
  })
})
```

### Шаг 3: Тестирование интерактивности
```typescript
import userEvent from '@testing-library/user-event'

it('обрабатывает клик на кнопку', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)
  
  const button = screen.getByRole('button', { name: /клик/i })
  await user.click(button)
  
  expect(screen.getByText('Результат')).toBeInTheDocument()
})
```

### Шаг 4: Запуск тестов
```bash
# Запустить все тесты
npm test

# Запустить в режиме watch (автоматический перезапуск)
npm run test:watch

# Запустить с покрытием кода
npm run test:coverage
```

## ✅ Чеклист для нового теста

- [ ] Тест проверяет поведение, а не реализацию
- [ ] Тест изолирован (не зависит от других тестов)
- [ ] Название теста понятное и описывает что проверяется
- [ ] Используются правильные селекторы (role > text > testid)
- [ ] Тест проходит успешно
- [ ] Тест покрывает основную функциональность

## 🚨 Частые ошибки

1. **Использование getByText когда есть несколько элементов**
   - ❌ `screen.getByText(/статья/i)` - если статей несколько
   - ✅ `screen.getAllByText(/статья/i)` - для множественных элементов

2. **Забыли обернуть компонент в провайдеры**
   - ❌ `render(<MyComponent />)` - если нужен LanguageProvider
   - ✅ `render(<LanguageProvider><MyComponent /></LanguageProvider>)`

3. **Асинхронные операции без await**
   - ❌ `screen.getByText('Loaded')` - если данные загружаются
   - ✅ `await screen.findByText('Loaded')` - для асинхронных элементов

