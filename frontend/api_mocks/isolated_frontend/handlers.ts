/* eslint-disable */
// @ts-nocheck
import { delay, http, HttpResponse } from 'msw'
import users from './data/users.json'
import workspaces from './data/workspaces.json'

const backendUrl = import.meta.env.VITE_BACKEND_URL

// Mock dataset
const MOCK_IMAGES = Array.from({ length: 34 }, (_, i) => ({
  id: String(i + 1),
  name: `Image${i + 1}`,
  url: `https://picsum.photos/seed/${i + 1}/300/200`,
}))

export const handlers = [
  /*
  ----------------------------------------------------------------------
  NOTE: These handlers simulate login/logout endpoints, but they do not
  manage real session state in the browser mock.

  MSW running in the browser (setupWorker) cannot persist or interpret 
  Set-Cookie headers. As a result, session state cannot be tracked via 
  cookies, and the user is effectively always logged in.

  These endpoints are included for completeness but are functionally 
  no-ops in terms of authentication state.
  ----------------------------------------------------------------------
  */
  http.post(`${backendUrl}/api/login`, async () => {
    await delay(2000)
    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`${backendUrl}/api/logout`, async () => {
    await delay(2000)
    return new Response(JSON.stringify({ status: 'logged out' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  //----------------------------------------------------------------------

  http.get<never, never, any>(`${backendUrl}/api/auth/current_user`, async () => {
    await delay(2000)
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: 'asdfasdf',
        role: 'ROLE_ADMIN',
      }),
    )
  }),

  //----------------------------------------------------------------------

  http.get('*/api/workspaces/:workspaceId/users', ({ params }) => {
    try {
      const { workspaceId } = params as { workspaceId: string }
      console.log('Mocking workspace users for:', workspaceId)
      return HttpResponse.json(users, { status: 200 })
    } catch (err) {
      console.error('Handler error:', err)
      return HttpResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }),

  http.get('*/api/workspaces', () => {
    try {
      console.log(`Mock: fetching workspaces`)
      console.log('Query data:', workspaces)
      return HttpResponse.json(workspaces, { status: 200 })
    } catch (err) {
      console.error('Handler error:', err)
      return HttpResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }),

  http.get('/api/workspaces/:workspaceId/images', ({ request }) => {
    try {
      console.log('Query data:', request)
      const url = new URL(request.url)
      const workspaceId = url.searchParams.get('workspaceId')

      const page = url.searchParams.get('page')
      const size = 8

      const startIndex = page * size
      const endIndex = startIndex + size

      console.log(startIndex)
      const content = MOCK_IMAGES.slice(startIndex, endIndex)

      return HttpResponse.json(
        {
          content,
          pageable: { pageNumber: page, pageSize: size },
          last: endIndex >= MOCK_IMAGES.length,
          totalPages: Math.ceil(MOCK_IMAGES.length / size),
          totalElements: MOCK_IMAGES.length,
          first: page === 0,
          numberOfElements: content.length,
          empty: content.length === 0,
        },
        { status: 200 },
      )
    } catch (err) {
      console.error('Error in images handler:', err)
      return HttpResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }),
]
