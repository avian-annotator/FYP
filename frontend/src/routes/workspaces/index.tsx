import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import WorkspaceCard from '@/components/workspace/WorkspaceCard'
import { createFileRoute, Outlet, useSearch } from '@tanstack/react-router'
import { AccessibleWorkspaceResponseDTO, useGetWorkspaces } from '../../../generated'
import { useState } from 'react'
import { CreateWorkspaceButton } from '@/components/workspace/createWorkspaceButton'
export const Route = createFileRoute('/workspaces/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetWorkspaces({ page: 1, size: 8 })
  const search = useSearch({ from: '/workspaces' }) satisfies {
    page: number
  }
  const initialPage = search.page ? search.page : 1
  const [page, setPage] = useState<number>(initialPage)

  const workspaces = data?.data.content ?? []
  const totalPages = data?.data.totalPages ?? 0
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading workspaces</p>

  return (
    <div className="max-w-4xl w-full mx-auto p-6 space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">My Workspaces</h2>
        <hr />
        {/* Workspaces */}
        <div className="space-y-2">
          {workspaces.map((ws: AccessibleWorkspaceResponseDTO) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  setPage((p: number) => Math.max(1, p - 1))
                }}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNumber = i + 1
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => {
                      setPage(pageNumber)
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  setPage((p: number) => Math.min(totalPages, p + 1))
                }}
                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <CreateWorkspaceButton></CreateWorkspaceButton>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Guest Workspaces</h2>
        <hr />
        <div className="space-y-2">{/*TODO add guest workspace logic*/}</div>
      </section>
      <Outlet />
    </div>
  )
}
