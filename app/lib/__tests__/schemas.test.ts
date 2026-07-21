import { createWebSiteSchema, createServiceSchema, createPersonSchema } from '../schemas'

describe('Schema Functions', () => {
  const siteUrl = 'https://www.aidardev.kz'

  describe('createWebSiteSchema', () => {
    it('создает правильную структуру WebSite schema', () => {
      const schema = createWebSiteSchema()
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('WebSite')
      expect(schema.url).toBe(siteUrl)
      expect(schema.name).toBe('aidardev — Development Studio')
    })
  })

  describe('createServiceSchema', () => {
    it('создает правильную структуру Service schema', () => {
      const service = {
        name: 'Web Development',
        description: 'Professional web development services',
        provider: 'Aidar',
        areaServed: 'Kazakhstan',
      }
      const schema = createServiceSchema(service)
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Service')
      expect(schema.serviceType).toBe(service.name)
      expect(schema.description).toBe(service.description)
      expect(schema.provider).toBeDefined()
      expect(schema.areaServed).toBeDefined()
    })
  })

  describe('createPersonSchema', () => {
    it('создает правильную структуру Person schema', () => {
      const schema = createPersonSchema()
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Person')
      expect(schema.name).toBe('aidardev')
      expect(schema.jobTitle).toBe('Development Studio')
      expect(schema.url).toBe(siteUrl)
      expect(schema.sameAs).toBeInstanceOf(Array)
    })
  })
})

