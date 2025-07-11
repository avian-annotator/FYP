import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAuth, useLogout } from '../auth'

export const Route = createRootRoute({
  component: function BaseLayout() {
    const { isAuthenticated } = useAuth()
    const mutation = useLogout()

    return (
      <>
        <div className="flex flex-row gap-x-2 ">
          Probably some sort of menu bar for logging in, logging out + nav links
          {isAuthenticated ? (
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => mutation.mutate()}
            >
              Log out
            </button>
          ) : (
            <Link className="px-4 py-2 bg-blue-500 text-white rounded" to="/login">
              Log in
            </Link>
          )}
        </div>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  },
})
