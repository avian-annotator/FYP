import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Login, useAuth } from '../auth'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

// Using role based auth to control access to the admin route
// Should this become a bigger, long term project, we should be using scopes/permissions instead of roles
// The endpoints are protected by the backend
function RouteComponent() {
  const auth = useAuth()
  return <>
    {
      auth.isAuthenticated && auth.userDetails?.role == "ROLE_ADMIN" ? <Outlet /> : <Login />
    }
  </>
}
