import { render, screen } from '@testing-library/react'
import AnimatedSection from '../AnimatedSection'

describe('AnimatedSection Component', () => {
  it('рендерится без ошибок', () => {
    render(
      <AnimatedSection animationType="fade-in" delay={0}>
        <div>Test Content</div>
      </AnimatedSection>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('передает children корректно', () => {
    render(
      <AnimatedSection animationType="fade-in" delay={0}>
        <h1>Test Heading</h1>
        <p>Test Paragraph</p>
      </AnimatedSection>
    )
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test Paragraph')).toBeInTheDocument()
  })

  it('применяет переданный className', () => {
    const { container } = render(
      <AnimatedSection className="test-class" animationType="slide-up" delay={0}>
        <div>Test</div>
      </AnimatedSection>
    )
    expect(container.firstChild).toHaveClass('test-class')
  })
})
