import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hi "/me/"!</div>
}
