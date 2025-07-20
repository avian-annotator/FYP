import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '../components/canvas'

export const Route = createFileRoute('/canvas')({
  component: RouteComponent,
})

// TODO: this route needs to be removed and placed in its appropriate area
// This is just a temp route, the canvas should be integrated with workspaces
function RouteComponent() {
  return <Canvas />
}
