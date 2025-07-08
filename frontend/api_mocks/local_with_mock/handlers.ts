// @ts-ignore
import { http, HttpResponse } from 'msw'

// @ts-ignore
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Handlers for browser-integration mocking of API requests. Backend is running as usual, with the local profile
export const handlers = [
  // DO NOT INCLUDE login/logout mocks here, as cookies can't be set in the browser mock, and therefore won't work properly
  // Functionally, that means that the user is always logged in. You can't log out.
  /*  http.get(`${backendUrl}/api/auth/current_user`, () => {
     return HttpResponse.json({
       "authenticated": true,
       "user": "asdfasdf",
       "role": "ROLE_ADMIN"
     })
   }), */
]
