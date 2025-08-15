import { createFileRoute } from '@tanstack/react-router'
import { WorkspacePage } from '@/pages/WorkspacePage'

export const Route = createFileRoute('/workspaces/$workspaceId/')({
  component: WorkspacePage,
})
