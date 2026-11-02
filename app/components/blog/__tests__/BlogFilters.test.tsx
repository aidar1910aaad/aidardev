import { render, screen, fireEvent } from '@testing-library/react'
import BlogFilters from '../BlogFilters'
import type { BlogPostCard } from '../../../lib/blog-utils'

// Мок данных для тестов: карточки на русском, как их отдаёт страница /ru/blog
const mockPosts: BlogPostCard[] = [
  {
    id: '1',
    slug: 'test-post-1',
    title: 'Тестовая статья 1',
    excerpt: 'Краткое описание 1',
    category: 'Веб-разработка',
    date: '2025-01-01',
    readingTime: 5,
  },
  {
    id: '2',
    slug: 'test-post-2',
    title: 'Тестовая статья 2',
    excerpt: 'Краткое описание 2',
    category: 'Маркетинг и SEO',
    date: '2025-01-02',
    readingTime: 10,
  },
]

const mockOnFilteredPostsChange = jest.fn()

describe('BlogFilters Component', () => {
  beforeEach(() => {
    mockOnFilteredPostsChange.mockClear()
  })

  it('рендерится без ошибок', () => {
    render(
      <BlogFilters 
        posts={mockPosts} 
        lang="ru" 
        onFilteredPostsChange={mockOnFilteredPostsChange} 
      />
    )
    expect(screen.getByPlaceholderText(/поиск статей|search articles/i)).toBeInTheDocument()
  })

  it('отображает все категории', () => {
    render(
      <BlogFilters 
        posts={mockPosts} 
        lang="ru" 
        onFilteredPostsChange={mockOnFilteredPostsChange} 
      />
    )
    expect(screen.getByText('Все статьи')).toBeInTheDocument()
    expect(screen.getByText('Веб-разработка')).toBeInTheDocument()
    expect(screen.getByText('Маркетинг и SEO')).toBeInTheDocument()
  })

  it('фильтрует по категории', () => {
    render(
      <BlogFilters 
        posts={mockPosts} 
        lang="ru" 
        onFilteredPostsChange={mockOnFilteredPostsChange} 
      />
    )
    
    const categoryButton = screen.getByText('Веб-разработка')
    fireEvent.click(categoryButton)
    
    // Проверяем, что callback был вызван с отфильтрованными постами
    expect(mockOnFilteredPostsChange).toHaveBeenCalled()
    const lastCall = mockOnFilteredPostsChange.mock.calls.at(-1)
    const filteredPosts = lastCall?.[0] ?? []
    expect(filteredPosts.length).toBe(1)
    expect(filteredPosts[0].category).toBe('Веб-разработка')
  })

  it('фильтрует по поисковому запросу', () => {
    render(
      <BlogFilters 
        posts={mockPosts} 
        lang="ru" 
        onFilteredPostsChange={mockOnFilteredPostsChange} 
      />
    )
    
    const searchInput = screen.getByPlaceholderText(/поиск статей|search articles/i)
    fireEvent.change(searchInput, { target: { value: 'статья 1' } })
    
    // Проверяем, что callback был вызван
    expect(mockOnFilteredPostsChange).toHaveBeenCalled()
  })

  it('очищает поисковый запрос', () => {
    render(
      <BlogFilters 
        posts={mockPosts} 
        lang="ru" 
        onFilteredPostsChange={mockOnFilteredPostsChange} 
      />
    )
    
    const searchInput = screen.getByPlaceholderText(/поиск статей|search articles/i)
    fireEvent.change(searchInput, { target: { value: 'тест' } })
    
    // Ищем кнопку очистки
    const clearButton = screen.getByLabelText(/очистить поиск|clear search/i)
    fireEvent.click(clearButton)
    
    expect(searchInput).toHaveValue('')
  })

  it('показывает количество найденных статей', () => {
    render(
      <BlogFilters 
        posts={mockPosts} 
        lang="ru" 
        onFilteredPostsChange={mockOnFilteredPostsChange} 
      />
    )
    
    const categoryButton = screen.getByText('Веб-разработка')
    fireEvent.click(categoryButton)
    
    expect(screen.getByText(/найдено: 1/i)).toBeInTheDocument()
  })
})





