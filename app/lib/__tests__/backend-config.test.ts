import { fetchBackend } from '../backend-config'

const response = (status: number) => ({ status, ok: status < 400 }) as Response

describe('fetchBackend', () => {
  const mockFetch = jest.fn()

  beforeEach(() => {
    mockFetch.mockReset()
    global.fetch = mockFetch as unknown as typeof fetch
    // Без реальных пауз между попытками
    jest.spyOn(global, 'setTimeout').mockImplementation(((fn: () => void) => {
      fn()
      return 0
    }) as unknown as typeof setTimeout)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('повторяет запрос после сетевой ошибки', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('fetch failed')).mockResolvedValueOnce(response(200))
    const res = await fetchBackend('https://api.test/posts', { next: { revalidate: 60 } })
    expect(res.status).toBe(200)
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ next: { revalidate: 60 } })
  })

  it('не повторяет 4xx', async () => {
    mockFetch.mockResolvedValue(response(404))
    const res = await fetchBackend('https://api.test/posts/missing')
    expect(res.status).toBe(404)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('после всех попыток отдаёт последний 5xx', async () => {
    mockFetch.mockResolvedValue(response(502))
    const res = await fetchBackend('https://api.test/posts', {}, 3)
    expect(res.status).toBe(502)
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('пробрасывает ошибку, если бэкенд так и не ответил', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'))
    await expect(fetchBackend('https://api.test/posts', {}, 2)).rejects.toThrow('fetch failed')
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})
