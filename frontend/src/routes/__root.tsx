import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAuth, useLogout } from '../auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createRootRoute({
  component: function BaseLayout() {
    const { isAuthenticated } = useAuth()
    const mutation = useLogout()

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute top-1 left-1 m-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="grid gap-2">
                Menu
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" align="start">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/workspaces" className="">
                      Workspaces
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/me" className="">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button
                      type="button"
                      className="w-full bg-blue-500 text-white rounded"
                      onClick={(): void => {
                        mutation.mutate()
                      }}
                    >
                      Log out
                    </button>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className="w-full block px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Log in
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex w-full h-full">
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    )
  },
})
