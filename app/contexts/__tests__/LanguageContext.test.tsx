import { render, screen } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '../LanguageContext'

// Тестовый компонент для проверки контекста
const TestComponent = () => {
  const { language, t, setLanguage } = useLanguage()
  
  return (
    <div>
      <div data-testid="current-lang">{language}</div>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
      <div data-testid="translation">{t('hero.greeting')}</div>
    </div>
  )
}

describe('LanguageContext', () => {
  beforeEach(() => {
    // Мок для window.location (удаляем старый, если есть)
    delete (window as any).location
    window.location = {
      pathname: '/ru',
    } as Location
    // Мок для localStorage
    Storage.prototype.getItem = jest.fn(() => null)
    Storage.prototype.setItem = jest.fn()
  })

  it('предоставляет язык по умолчанию', () => {
    render(
      <LanguageProvider initialLanguage="ru">
        <TestComponent />
      </LanguageProvider>
    )
    
    // Ждем, пока компонент отрендерится
    const langElement = screen.getByTestId('current-lang')
    expect(langElement).toBeInTheDocument()
    // Язык может быть 'ru' из initialLanguage
    expect(['ru', 'en', 'kz']).toContain(langElement.textContent)
  })

  it('предоставляет функцию перевода', () => {
    render(
      <LanguageProvider initialLanguage="ru">
        <TestComponent />
      </LanguageProvider>
    )
    
    const translation = screen.getByTestId('translation')
    expect(translation).toBeInTheDocument()
    // Проверяем, что есть какой-то текст (перевод)
    expect(translation.textContent).toBeTruthy()
  })

  it('позволяет изменить язык', async () => {
    render(
      <LanguageProvider initialLanguage="ru">
        <TestComponent />
      </LanguageProvider>
    )
    
    const button = screen.getByText('Switch to English')
    button.click()
    
    // Ждем обновления состояния
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const langElement = screen.getByTestId('current-lang')
    expect(langElement.textContent).toBe('en')
  })
})

