import { createFileRoute } from '@tanstack/react-router'
import { Me } from '@/pages/Me'

export const Route = createFileRoute('/me/')({
  component: Me,
})
