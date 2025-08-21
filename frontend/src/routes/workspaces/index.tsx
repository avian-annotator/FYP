import { createFileRoute } from '@tanstack/react-router'
import { WorkspacesHome } from '@/pages/WorkspacesHome'
import z from 'zod'

export const Route = createFileRoute('/workspaces/')({
  component: WorkspacesHome,
  validateSearch: z.object({
    page: z.number().default(0),
  }),
})
