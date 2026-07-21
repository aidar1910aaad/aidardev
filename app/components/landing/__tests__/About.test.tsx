import { render, screen } from '@testing-library/react'
import About from '../About'
import { LanguageProvider } from '../../../contexts/LanguageContext'

// Мок для analytics
jest.mock('../../../lib/analytics', () => ({
  analyticsEvents: {
    serviceClick: jest.fn(),
  },
}))

// Мок для StructuredData
jest.mock('../../SEO/StructuredData', () => {
  return function MockStructuredData() {
    return null
  }
})

// Обертка для компонента с провайдером языка
const AboutWithProvider = () => (
  <LanguageProvider initialLanguage="ru">
    <About />
  </LanguageProvider>
)

describe('About Component', () => {
  it('рендерится без ошибок', () => {
    const { container } = render(<AboutWithProvider />)
    expect(container.querySelector('#about')).toBeInTheDocument()
  })

  it('отображает заголовок секции', () => {
    render(<AboutWithProvider />)
    // Ищем заголовок "Обо мне" или "About"
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })

  it('отображает услуги', () => {
    render(<AboutWithProvider />)
    // Проверяем наличие кнопок услуг (их должно быть минимум 6)
    const serviceButtons = screen.getAllByRole('button')
    expect(serviceButtons.length).toBeGreaterThanOrEqual(6)
  })

  it('имеет правильную структуру секции', () => {
    const { container } = render(<AboutWithProvider />)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })
})





