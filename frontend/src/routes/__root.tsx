import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthContextType, useAuth } from '../auth'

interface RouterContext {
  auth: AuthContextType | undefined
}

const queryClient = new QueryClient()

export const Route = createRootRouteWithContext<RouterContext>()({

  component: () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          Probably some sort of menu bar for logging in, logging out + nav links
        </div>
        <Outlet />
        <TanStackRouterDevtools />
      </QueryClientProvider>
    );
  },
})

