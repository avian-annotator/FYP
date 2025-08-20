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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type WorkspaceUsersParams = {
  workspaceId: number
}
export function WorkspaceUsers() {
  const [page, setPage] = useState<number>(0)
  const { workspaceId }: WorkspaceUsersParams = useParams({ from: Route.id })
  const { data, error, refetch } = useGetUsersFromWorkspace(
    workspaceId,
    { excludeExisting: false },
    { page },
  )

  useEffect(() => {
    void refetch()
  }, [page])

  //get name to display using edit patch request
  const [workspaceName, setWorkspaceName] = useState('')
  const editWorkspaceRequestBodyDTO: EditWorkspaceRequestBodyDTO = {
    name: workspaceName,
  }

  const users = data?.data.content === undefined ? [] : data.data.content
  const totalUsers = data?.data.totalElements ?? 0
  const size = data?.data.size === undefined ? 0 : data.data.size

  const totalPages = Math.ceil(totalUsers / size)

  const { mutateAsync } = useEditWorkspace(workspaceId, editWorkspaceRequestBodyDTO)
  const fetchWorkspaceName = useCallback(async () => {
    const res = await mutateAsync(undefined)
    setWorkspaceName(res.data.name)
  }, [mutateAsync])

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

  const isFirstPage = page === 0
  const isLastPage = page === totalPages - 1

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  return (
    <Suspense fallback={<Skeleton className="h-[20px] w-[100px] rounded-full" />}>
      <div className="max-w-3xl w-full mx-auto p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Users of Workspace: {workspaceName}</h2>
          <hr />
          {/* Users */}
          <div className="space-y-2">
            {users.length > 0 ? (
              users.map(usr => <UserCard key={usr.id} user={usr} workspaceId={workspaceId} />)
            ) : (
              <p className="text-gray-500">No users found for this workspace.</p>
            )}
          </div>
          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    handlePageChange(Math.max(0, page - 1))
                  }}
                  className={isFirstPage ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i}
                    onClick={() => {
                      handlePageChange(i)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    handlePageChange(Math.min(totalPages - 1, page + 1))
                  }}
                  className={isLastPage ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

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
