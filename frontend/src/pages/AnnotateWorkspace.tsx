import { useParams } from '@tanstack/react-router'
import React from 'react'
import { Route } from '../routes/workspaces/$workspaceId/annotate'

const AnnotateWorkspace: React.FC = () => {
  const params = useParams({ from: Route.id }) satisfies { workspaceId: number }

  return <div>Annotate Workspace: {params.workspaceId}</div>
  //TODO: create annotation page
}
export default AnnotateWorkspace
