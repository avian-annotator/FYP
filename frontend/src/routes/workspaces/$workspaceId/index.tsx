import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import { createFileRoute, useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { ImageCard } from '@/components/workspace/ImageCard'
import ImageUploadButton from '@/components/workspace/ImageUploadButton'
import { ImageItem, PaginationResponse } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { fetchImages } from '@/components/workspace/getImages'

export const Route = createFileRoute('/workspaces/$workspaceId/')({
  component: WorkspacePage,
})

function WorkspacePage() {
  const params = useParams({ from: '/workspaces/$workspaceId' }) satisfies {
    workspaceId: string
  }
  const search = useSearch({ from: '/workspaces/$workspaceId' }) satisfies {
    page: number
  }
  const initialPage = search.page ? search.page : 1
  const [page, setPage] = useState<number>(initialPage)

  const { data, isLoading, isError, error } = useQuery<PaginationResponse>({
    queryKey: ['images', params.workspaceId, page],
    queryFn: () => fetchImages(params.workspaceId, page),
  })
  if (isLoading) {
    return <div>Loading images...</div>
  }

  if (isError) {
    return <div>Error loading images: {error.message}</div>
  }
  const totalPages = data?.totalPages || 0

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Workspace {params.workspaceId}</h1>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.content.map((img: ImageItem) => (
          <ImageCard filename={img.filename} key={img.key} url={img.url}></ImageCard>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
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
      )}
      <ImageUploadButton workspaceId={params.workspaceId}></ImageUploadButton>
    </div>
  )
}
