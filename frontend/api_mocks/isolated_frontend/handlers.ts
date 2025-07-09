import { delay, http } from 'msw';

// @ts-ignore
const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
    return new Response(
      JSON.stringify({ status: 'success' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }),

  http.post(`${backendUrl}/api/logout`, async () => {
    await delay(2000)
    return new Response(
      JSON.stringify({ status: 'logged out' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }),

  //----------------------------------------------------------------------

  http.get<never, never, any>(`${backendUrl}/api/auth/current_user`, async () => {
    await delay(2000)
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: 'asdfasdf',
        role: 'ROLE_ADMIN',
      }))
  })
  ,
];
