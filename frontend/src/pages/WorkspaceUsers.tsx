import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/users'
import UserCard from '@/components/users/UserCard'

import { useGetUsersFromWorkspace } from '../../generated'
import { AddUserButton } from '@/components/users/AddUserButton'

type WorkspaceUsersParams = {
  workspaceId: number
}
export function WorkspaceUsers() {
  const { workspaceId }: WorkspaceUsersParams = useParams({ from: Route.id })
  const { data, isLoading, error } = useGetUsersFromWorkspace(workspaceId, {}, { size: 4, page: 0 })
  const users = data?.data.content === undefined ? [] : data.data.content

  if (isLoading) return <p>Loading workspace users...</p>
  if (error) {
    return (
      <p className="text-red-500">
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    )
  }

  return (
    <div className="max-w-3xl w-full mx-auto p-6 space-y-6">
      <section>
        {/* TODO: Add workspace name instead of ID */}
        <h2 className="text-xl font-semibold mb-2">Users of Workspace: {workspaceId}</h2>
        <hr />
        <div className="space-y-2">
          {users.length > 0 ? (
            users.map(usr => <UserCard key={usr.id} user={usr} />)
          ) : (
            <p className="text-gray-500">No users found for this workspace.</p>
          )}
        </div>
        {/* TODO: Add new user logic*/}
        <AddUserButton workspace={workspaceId}></AddUserButton>
      </section>
    </div>
  )
}

export default WorkspaceUsers
