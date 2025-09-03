import WorkspaceUsers from '@/pages/WorkspaceUsers'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/workspaces/$workspaceId/users')({
  component: WorkspaceUsers,
  validateSearch: z.object({
    page: z.number().default(0),
  }),
})
