function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/* eslint-disable */
// @ts-nocheck
import { http, HttpResponse } from 'msw'
import users from './data/users.json'
import workspaces from './data/workspaces.json'

// @ts-ignore
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const handlers = [
  http.get(`${backendUrl}/api/auth/current_user`, async () => {
    await delay(2000)
    return HttpResponse.json({
      authenticated: true,
      user: 'asdfasdf',
      role: 'ROLE_ADMIN',
    })
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

  http.get('*/api/workspaces', ({ params }) => {
    try {
      console.log(`Mock: fetching workspaces`)
      console.log('Query data:', workspaces)
      return HttpResponse.json(workspaces, { status: 200 })
    } catch (err) {
      console.error('Handler error:', err)
      return HttpResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }),
]
