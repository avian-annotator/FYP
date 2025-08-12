import { useParams } from '@tanstack/react-router'
import React from 'react'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'

const AnnotateWorkspace: React.FC = () => {
  const params = useParams({ from: Route.id }) satisfies {
    workspaceId: string
    imageId: number
    url: string
  }

  return (
    <div>
      Annotate Workspace: {params.workspaceId}, Image: {params.imageId}{' '}
    </div>
  )
  //TODO: create annotation page
}
export default AnnotateWorkspace
