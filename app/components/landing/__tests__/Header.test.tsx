import { render, screen } from '@testing-library/react'
import Header from '../EditorialHeader'
import { LanguageProvider } from '../../../contexts/LanguageContext'
import { ThemeProvider } from '../../../contexts/ThemeContext'

const HeaderWithProvider = () => (
  <ThemeProvider>
    <LanguageProvider initialLanguage="ru">
      <Header />
    </LanguageProvider>
  </ThemeProvider>
)

describe('Header Component', () => {
  it('рендерится без ошибок', () => {
    render(<HeaderWithProvider />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('содержит навигационные ссылки', () => {
    render(<HeaderWithProvider />)
    // Проверяем наличие навигации
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('содержит переключатель языка', () => {
    render(<HeaderWithProvider />)
    expect(screen.getByText('RU')).toBeInTheDocument()
  })

  it('имеет правильную структуру header', () => {
    const { container } = render(<HeaderWithProvider />)
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
  })
})

