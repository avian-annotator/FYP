function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* eslint-disable */
// @ts-nocheck
import { http, HttpResponse } from 'msw'

// @ts-ignore
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const handlers = [
  http.get(`${backendUrl}/api/auth/current_user`, async () => {
    await delay(2000);
    return HttpResponse.json({
      "authenticated": true,
      "user": "asdfasdf",
      "role": "ROLE_ADMIN"
    });
  }),
]
