import { render, screen } from '@testing-library/react'
import Hero from '../EditorialHero'
import { LanguageProvider } from '../../../contexts/LanguageContext'

// Мок для analytics
jest.mock('../../../lib/analytics', () => ({
  analyticsEvents: {
    scrollToSection: jest.fn(),
    calculatePriceClick: jest.fn(),
    contactButtonClick: jest.fn(),
    whatsappClick: jest.fn(),
  },
}))

// Обертка для компонента с провайдером языка
const HeroWithProvider = () => (
  <LanguageProvider initialLanguage="ru">
    <Hero />
  </LanguageProvider>
)

describe('Hero Component', () => {
  beforeEach(() => {
    // Мок для scrollIntoView
    Element.prototype.scrollIntoView = jest.fn()
  })

  it('рендерится без ошибок', () => {
    render(<HeroWithProvider />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('превращают внимание в заявки')
  })

  it('отображает конкретное позиционирование студии', () => {
    render(<HeroWithProvider />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('сайты и автоматизацию')
  })

  it('отображает CTA-ссылки с локализованными маршрутами', () => {
    render(<HeroWithProvider />)
    expect(screen.getByRole('link', { name: /Обсудить в WhatsApp/i })).toHaveAttribute('href', expect.stringContaining('https://wa.me/77066703696?text='))
    expect(screen.getAllByRole('link', { name: /Смотреть кейсы/i })[0]).toHaveAttribute('href', '/ru#projects')
    expect(screen.getByRole('link', { name: /Услуги и цены/i })).toHaveAttribute('href', '/ru/pricing')
  })

  it('отображает проверяемые сигналы доверия без счетчиков', () => {
    render(<HeroWithProvider />)
    expect(screen.getAllByText(/Объём и сроки фиксируем в договоре/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Разработка, маркетинг и AI одной командой/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/47\+/)).not.toBeInTheDocument()
  })

  it('имеет правильную структуру секции', () => {
    const { container } = render(<HeroWithProvider />)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('relative', 'editorial-grid')
  })
})

