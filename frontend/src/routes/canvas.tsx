import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '../components/canvas'

export const Route = createFileRoute('/canvas')({
  component: RouteComponent,
})

// TODO: this route needs to be removed and placed in its appropriate area
function RouteComponent() {
  return <Canvas />
}
