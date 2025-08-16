import { createFileRoute } from '@tanstack/react-router'
import { WorkspacesHome } from '@/pages/WorkspacesHome'

export const Route = createFileRoute('/workspaces/')({
  component: WorkspacesHome,
})
