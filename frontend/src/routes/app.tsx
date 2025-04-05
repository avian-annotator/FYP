import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Login, useAuth } from '../auth'

export const Route = createFileRoute('/app')({
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
