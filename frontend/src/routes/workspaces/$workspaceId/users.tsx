import WorkspaceUsers from '@/pages/WorkspaceUsers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/$workspaceId/users')({
  component: WorkspaceUsers,
})
