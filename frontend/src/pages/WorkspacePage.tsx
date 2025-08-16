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
import { useState } from 'react'
import { WorkspaceResponseDTO } from 'generated'

//TODO: add edit workspace feature

export function WorkspacePage() {
  const params: WorkspaceResponseDTO = useParams({ from: '/workspaces/$workspaceId/' })

  const initialPage = 1
  const [page, setPage] = useState<number>(initialPage)

  //TODO: remove and replace with generated hooks
  const { data, isLoading, isError, error } = useQuery<PaginationResponse>({
    queryKey: ['images', params.id, page],
    queryFn: () => fetchImages(params.id, page),
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
      <h1 className="text-2xl font-bold">Workspace {params.id}</h1>

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
      <ImageUploadButton workspaceId={params.id}></ImageUploadButton>
    </div>
  )
}
