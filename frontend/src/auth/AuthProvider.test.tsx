import { expect, test, beforeAll, afterAll, afterEach } from 'bun:test'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Example test. Run using `bun test` in the terminal.

const backendUrl = process.env.VITE_BACKEND_URL

const baseUrl = backendUrl ?? 'http://localhost:8080'

export const handlers = [
  http.post(`${baseUrl}/api/login`, () => {
    return HttpResponse.json({
      status: 'success',
    })
  }),

  http.get(`${baseUrl}/api/auth/current_user`, () => {
    return HttpResponse.json({
      status: 'success',
    })
  }),
]

const server = setupServer(...handlers)

beforeAll((): void => {
  server.listen()
})
afterEach((): void => {
  server.resetHandlers()
})
afterAll((): void => {
  server.close()
})

test('useLogin', () => {
  expect(2 + 2).toBe(4)
})
