import { analyticsEvents } from '../analytics'

// Мок для window.gtag
const mockGtag = jest.fn()
global.gtag = mockGtag

describe('Analytics Events', () => {
  beforeEach(() => {
    mockGtag.mockClear()
  })

  it('отправляет событие scrollToSection', () => {
    analyticsEvents.scrollToSection('projects')
    expect(mockGtag).toHaveBeenCalledWith('event', 'scroll_to_section', {
      event_category: 'Navigation',
      event_label: 'projects',
      value: 1,
    })
  })

  it('отправляет событие calculatePriceClick', () => {
    analyticsEvents.calculatePriceClick('Hero Button')
    expect(mockGtag).toHaveBeenCalledWith('event', 'calculate_price_click', {
      event_category: 'Lead',
      event_label: 'Hero Button',
      value: 1,
    })
  })

  it('отправляет событие contactButtonClick как навигацию', () => {
    analyticsEvents.contactButtonClick('Footer')
    expect(mockGtag).toHaveBeenCalledWith('event', 'contact_button_click', {
      event_category: 'Navigation',
      event_label: 'Footer',
      value: 1,
    })
  })

  it('отправляет whatsapp_click как лид', () => {
    analyticsEvents.whatsappClick('77066703696', 'home_hero')
    expect(mockGtag).toHaveBeenCalledWith('event', 'whatsapp_click', {
      event_category: 'Lead',
      event_label: '77066703696',
      source: 'home_hero',
      value: 1,
    })
  })

  it('отправляет phone_call как лид', () => {
    analyticsEvents.phoneCall('+7 706 670 36 96', 'footer')
    expect(mockGtag).toHaveBeenCalledWith('event', 'phone_call', {
      event_category: 'Lead',
      event_label: '+7 706 670 36 96',
      source: 'footer',
      value: 1,
    })
  })

  it('отправляет событие chatbotOpen', () => {
    analyticsEvents.chatbotOpen()
    expect(mockGtag).toHaveBeenCalledWith('event', 'chatbot_open', {
      event_category: 'Engagement',
      event_label: 'AI Chat',
      value: 1,
    })
  })
})

