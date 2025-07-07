import { createRootRouteWithContext, Link, Navigate, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthContextType, useAuth, useLogout } from '../auth'

interface RouterContext {
  auth: AuthContextType | undefined
}

export const Route = createRootRouteWithContext<RouterContext>()({

  component: () => {
    const { isAuthenticated } = useAuth()
    const mutation = useLogout()

    return (
      <>
        <div>
          Probably some sort of menu bar for logging in, logging out + nav links
          {
            isAuthenticated ? (
              <button onClick={() => mutation.mutate()}>Log out</button>
            ) : (
              <Link to="/login">Log in</Link>
            )
          }
        </div>
        <Outlet />
        <TanStackRouterDevtools />
      </>

    );
  },
})

