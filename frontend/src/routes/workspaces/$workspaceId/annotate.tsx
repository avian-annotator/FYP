import AnnotateWorkspace from '@/pages/AnnotateWorkspace'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/$workspaceId/annotate')({
  component: AnnotateWorkspace,
})
