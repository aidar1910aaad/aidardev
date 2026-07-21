import { render, screen } from '@testing-library/react'
import Footer from '../Footer'
import { LanguageProvider } from '../../../contexts/LanguageContext'

const FooterWithProvider = () => (
  <LanguageProvider initialLanguage="ru">
    <Footer />
  </LanguageProvider>
)

describe('Footer Component', () => {
  it('рендерится без ошибок', () => {
    render(<FooterWithProvider />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('содержит ссылки на социальные сети', () => {
    render(<FooterWithProvider />)
    // Ищем ссылки (GitHub, LinkedIn и т.д.)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('содержит информацию о копирайте', () => {
    render(<FooterWithProvider />)
    // Проверяем наличие года или копирайта
    const copyright = screen.getByText(/202/i) // Ищем год
    expect(copyright).toBeInTheDocument()
  })

  it('имеет правильную структуру footer', () => {
    const { container } = render(<FooterWithProvider />)
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })
})

