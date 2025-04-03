import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          Probably some sort of menu bar for logging in, logging out + nav links
        </div>
        <Outlet />
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </>
  ),
})
