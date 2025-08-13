import { useParams } from '@tanstack/react-router'
import React from 'react'
import { Route } from '../routes/workspaces/$workspaceId/users'
import { Button } from '@/components/ui/button'
import UserCard from '@/components/users/UserCard'
import { getWorkspaceUsers } from '@/components/workspace/getWorkspaceUsers'
import { useQuery } from '@tanstack/react-query'

type WorkspaceUsersParams = {
  workspaceId: number
}
const WorkspaceUsers: React.FC = () => {
  const { workspaceId }: WorkspaceUsersParams = useParams({ from: Route.id })

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    //TODO: update to use endpoints when they come out
    queryKey: ['workspaceUsers', workspaceId],
    queryFn: () => getWorkspaceUsers(workspaceId),
    staleTime: 1000 * 60,
  })

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
        <h2 className="text-xl font-semibold mb-2">Users of {workspaceId}</h2>
        <hr />
        <div className="space-y-2">
          {users && users.length > 0 ? (
            users.map(usr => <UserCard key={usr.id} user={usr} />)
          ) : (
            <p className="text-gray-500">No users found for this workspace.</p>
          )}
        </div>
        <Button className="mt-4 text-green-600 bg-green-100 hover:bg-green-200" variant="ghost">
          Add new user to workspace?
        </Button>
      </section>
    </div>
  )
}

export default WorkspaceUsers
