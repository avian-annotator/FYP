import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '../canvas'

export const Route = createFileRoute('/canvas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Canvas />
}
