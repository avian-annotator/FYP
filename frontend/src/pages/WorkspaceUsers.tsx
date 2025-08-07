import { useParams } from '@tanstack/react-router'
import React from 'react'
import { Route } from '../routes/workspaces/$workspaceId/users'

const WorkspaceUsers: React.FC = () => {
  const { workspaceId } = useParams({ from: Route.id }) satisfies { workspaceId: number }

  return <div>Manage users: {workspaceId}</div>
  //TODO: create manage users page
}

export default WorkspaceUsers
