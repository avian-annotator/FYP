import Admin from '@/pages/Admin'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/admin/')({
  component: Admin,
  validateSearch: z.object({
    page: z.number().default(0),
  }),
})
