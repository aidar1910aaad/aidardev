import { render, screen, fireEvent } from '@testing-library/react'
import BlogFilters from '../BlogFilters'
import type { BlogPost } from '../../../data/blog-posts'

// Мок данных для тестов
const mockPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'test-post-1',
    title: { ru: 'Тестовая статья 1', en: 'Test Post 1', kz: 'Тест мақаласы 1' },
    description: { ru: 'Описание 1', en: 'Description 1', kz: 'Сипаттама 1' },
    excerpt: { ru: 'Краткое описание 1', en: 'Excerpt 1', kz: 'Қысқаша сипаттама 1' },
    category: { ru: 'Веб-разработка', en: 'Web Development', kz: 'Веб-дамыту' },
    date: '2025-01-01',
    keywords: { ru: ['тест'], en: ['test'], kz: ['тест'] },
    readingTime: 5,
    published: true,
    content: { ru: '', en: '', kz: '' },
  },
  {
    id: '2',
    slug: 'test-post-2',
    title: { ru: 'Тестовая статья 2', en: 'Test Post 2', kz: 'Тест мақаласы 2' },
    description: { ru: 'Описание 2', en: 'Description 2', kz: 'Сипаттама 2' },
    excerpt: { ru: 'Краткое описание 2', en: 'Excerpt 2', kz: 'Қысқаша сипаттама 2' },
    category: { ru: 'Маркетинг и SEO', en: 'Marketing & SEO', kz: 'Маркетинг және SEO' },
    date: '2025-01-02',
    keywords: { ru: ['тест'], en: ['test'], kz: ['тест'] },
    readingTime: 10,
    published: true,
    content: { ru: '', en: '', kz: '' },
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
    expect(filteredPosts[0].category.ru).toBe('Веб-разработка')
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





