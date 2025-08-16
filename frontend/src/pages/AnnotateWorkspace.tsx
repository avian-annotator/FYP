import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'

type AnnotateWorkspaceParams = {
  workspaceId: string
  imageId: number
  url: string
}

export function AnnotateWorkspace() {
  const params: AnnotateWorkspaceParams = useParams({ from: Route.id })

  return (
    <div>
      Annotate Workspace: {params.workspaceId}, Image: {params.imageId}{' '}
    </div>
  )
  //TODO: create annotation page
}
export default AnnotateWorkspace
