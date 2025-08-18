import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/users'
import UserCard from '@/components/users/UserCard'
import { Skeleton } from '@/components/ui/skeleton'

import {
  EditWorkspaceRequestBodyDTO,
  useEditWorkspace,
  useGetUsersFromWorkspace,
} from '../../generated'
import { AddUserButton } from '@/components/users/AddUserButton'
import { EditWorkspaceButton } from '@/components/workspace/EditWorkspaceButton'
import { useState, useEffect, useCallback, Suspense } from 'react'

type WorkspaceUsersParams = {
  workspaceId: number
}
export function WorkspaceUsers() {
  const { workspaceId }: WorkspaceUsersParams = useParams({ from: Route.id })
  const { data, error } = useGetUsersFromWorkspace(workspaceId, {}, { size: 4, page: 0 })
  const users = data?.data.content === undefined ? [] : data.data.content

  //get name to display using edit patch request
  const [workspaceName, setWorkspaceName] = useState('')
  const editWorkspaceRequestBodyDTO: EditWorkspaceRequestBodyDTO = {
    name: workspaceName,
  }

  const { mutateAsync } = useEditWorkspace(workspaceId, editWorkspaceRequestBodyDTO)
  const fetchWorkspaceName = useCallback(async () => {
    const res = await mutateAsync(undefined)
    setWorkspaceName(res.data.name)
  }, [useEditWorkspace])

  useEffect(() => {
    void fetchWorkspaceName()
  }, [fetchWorkspaceName])

  if (error) {
    return (
      <p className="text-red-500">
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    )
  }

  return (
    <Suspense fallback={<Skeleton className="h-[20px] w-[100px] rounded-full" />}>
      <div className="max-w-3xl w-full mx-auto p-6 space-y-6">
        <section>
          {/* TODO: Add user pagination */}
          <h2 className="text-xl font-semibold mb-2">Users of Workspace: {workspaceName}</h2>
          <hr />

          <div className="space-y-2">
            {users.length > 0 ? (
              users.map(usr => <UserCard key={usr.id} user={usr} />)
            ) : (
              <p className="text-gray-500">No users found for this workspace.</p>
            )}
          </div>

          <div className="*:mr-4">
            <AddUserButton workspace={workspaceId}></AddUserButton>
            <EditWorkspaceButton workspace={workspaceId} name={workspaceName}></EditWorkspaceButton>
          </div>
        </section>
      </div>
    </Suspense>
  )
}

export default WorkspaceUsers
