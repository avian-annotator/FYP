import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import { CreateWorkspaceButton } from '@/components/workspace/CreateWorkspaceButton'
import WorkspaceCard from '@/components/workspace/WorkspaceCard'
import { useGetWorkspaces, AccessibleWorkspaceResponseDTO } from '../../generated'
import { Route } from '../routes/workspaces/'

export function WorkspacesHome() {
  const { page } = Route.useSearch()
  const navigate = Route.useNavigate()

  // Fetch workspaces with the current page
  const { data, isLoading, error } = useGetWorkspaces({ size: 4, page })

  const workspaces = data?.data.content === undefined ? [] : data.data.content
  const totalPages = data?.data.totalPages === undefined ? 0 : data.data.totalPages

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading workspaces</p>

  const isFirstPage = data?.data.first
  const isLastPage = data?.data.last

  const handlePageChange = (newPage: number) => {
    void navigate({
      search: prev => ({ ...prev, page: newPage }),
    })
  }

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
                  {i}
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
        <CreateWorkspaceButton></CreateWorkspaceButton>
      </section>
    </div>
  )
}
