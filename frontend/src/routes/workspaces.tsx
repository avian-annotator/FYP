import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Login, useAuth } from '../auth'

export const Route = createFileRoute('/workspaces')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth()
  return <>
    {
      auth.isAuthenticated ? <Outlet /> : <Login />
    }
  </>
}
