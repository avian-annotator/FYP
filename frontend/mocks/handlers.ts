import { http, HttpResponse } from 'msw'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Handlers for browser-integration mocking of API requests
export const handlers = [
  http.post(`${backendUrl}/api/login`, () => {
    return HttpResponse.json({
      "status": "success",
    })
  }),

  http.post(`${backendUrl}/api/logout`, () => {
    return HttpResponse.json({
      "status": "logged out",
    })
  }),

  http.get(`${backendUrl}/api/auth/current_user`, () => {
    return HttpResponse.json({
      "authenticated": true,
      "user": "asdfasdf",
      "role": "ROLE_ADMIN"
    })
  }),

]
