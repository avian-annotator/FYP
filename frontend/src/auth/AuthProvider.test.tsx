import { expect, test, beforeAll, afterAll, afterEach } from 'bun:test'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Example test. Run using `bun test` in the terminal.

const backendUrl = process.env.VITE_BACKEND_URL

export const handlers = [
  http.post(`${backendUrl}/api/login`, () => {
    return HttpResponse.json({
      status: 'success',
    })
  }),

  http.get(`${backendUrl}/api/auth/current_user`, () => {
    return HttpResponse.json({
      status: 'success',
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('useLogin', () => {
  expect(2 + 2).toBe(4)
})
