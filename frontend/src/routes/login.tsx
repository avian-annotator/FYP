import { createFileRoute } from '@tanstack/react-router'
import Login from '../auth/Login'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Login/>
}
