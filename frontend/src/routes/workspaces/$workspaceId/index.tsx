import { createFileRoute } from '@tanstack/react-router'
import { WorkspacePage } from '@/pages/WorkspacePage'
import z from 'zod'

export const Route = createFileRoute('/workspaces/$workspaceId/')({
  component: WorkspacePage,
  validateSearch: z.object({
    page: z.number().default(0),
  }),
})
