import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import { fetchImages } from '@/components/workspace/getImages'
import { ImageCard } from '@/components/images/ImageCard'
import ImageUploadButton from '@/components/images/ImageUploadButton'
import { PaginationResponse, ImageItem } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId'

type WorkspaceParams = {
  workspaceId: number
}

export function WorkspacePage() {
  const { workspaceId }: WorkspaceParams = useParams({ from: Route.id })
  const { page } = Route.useSearch()
  const navigate = Route.useNavigate()

  //TODO: remove and replace with generated hooks
  const { data } = useQuery<PaginationResponse>({
    queryKey: ['images', workspaceId, page],
    queryFn: () => fetchImages(workspaceId, page),
  })

  const totalPages = data?.totalPages || 0

  const isFirstPage = data?.first
  const isLastPage = data?.last

  const handlePageChange = (newPage: number) => {
    void navigate({
      search: prev => ({ ...prev, page: newPage }),
    })
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Workspace {workspaceId}</h1>

      {!data?.content && (
        <div className="flex flex-col items-center justify-center p-10 space-y-4 text-gray-500 border-2 border-dashed rounded-lg">
          <p className="text-lg">No images found for this workspace.</p>
          <p className="text-sm">Upload some pictures to get started!</p>
        </div>
      )}
      {data?.content && (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.content.map((img: ImageItem) => (
              <ImageCard filename={img.filename} key={img.key} url={img.url}></ImageCard>
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
        </>
      )}
      <ImageUploadButton workspaceId={workspaceId}></ImageUploadButton>
    </div>
  )
}
