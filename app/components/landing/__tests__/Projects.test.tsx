import { render, screen } from '@testing-library/react'
import type { ImgHTMLAttributes } from 'react'
import Projects from '../Projects'
import { LanguageProvider } from '../../../contexts/LanguageContext'

// Мок для analytics
jest.mock('../../../lib/analytics', () => ({
  analyticsEvents: {
    projectLinkClick: jest.fn(),
    projectsShowAllToggle: jest.fn(),
    whatsappClick: jest.fn(),
  },
}))

// Мок для Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Обертка для компонента с провайдером языка
const ProjectsWithProvider = () => (
  <LanguageProvider initialLanguage="ru">
    <Projects />
  </LanguageProvider>
)

describe('Projects Component', () => {
  it('рендерится без ошибок', () => {
    const { container } = render(<ProjectsWithProvider />)
    expect(container.querySelector('#projects')).toBeInTheDocument()
  })

  it('отображает заголовок секции', () => {
    render(<ProjectsWithProvider />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })

  it('отображает проекты', () => {
    render(<ProjectsWithProvider />)
    // Проверяем наличие проектов (минимум 3 должны быть видны)
    const projectCards = screen.getAllByRole('article')
    expect(projectCards.length).toBeGreaterThanOrEqual(3)
  })

  it('имеет кнопку раскрытия списка проектов', () => {
    render(<ProjectsWithProvider />)
    const showAllButton = screen.getByRole('button', { name: /показать еще|show more/i })
    expect(showAllButton).toBeInTheDocument()
  })
})





