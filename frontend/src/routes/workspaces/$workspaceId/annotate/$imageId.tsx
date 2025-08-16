import AnnotateWorkspace from '@/pages/AnnotateWorkspace'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/$workspaceId/annotate/$imageId')({
  component: AnnotateWorkspace,
})
