import UserCard from '@/components/users/UserCard'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetAllUsers } from '../../generated'
import { CreateUserButton } from '@/components/users/CreateUserButton'
import { Suspense } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useSearch, useNavigate } from '@tanstack/react-router'
export function Admin() {
  const { page } = useSearch({ from: '/admin/' })
  const navigate = useNavigate({ from: '/admin/' })

  const { data, error } = useGetAllUsers({ page, size: 5 })

  const users = data?.data.content === undefined ? [] : data.data.content
  const totalPages = data?.data.totalPages === undefined ? 0 : data.data.totalPages

  if (error) {
    return (
      <p className="text-red-500">
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    )
  }

  const isFirstPage = data?.data.first
  const isLastPage = data?.data.last

  const handlePageChange = (newPage: number) => {
    void navigate({
      search: prev => ({ ...prev, page: newPage }),
    })
  }

  return (
    <Suspense fallback={<Skeleton className="h-[20px] w-[100px] rounded-full" />}>
      <div className="max-w-3xl w-full mx-auto p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">All users in Avian Annotator</h2>
          <hr />
          {/* Users */}
          <div className="space-y-2">
            {users.length > 0 ? (
              users.map(usr => <UserCard key={usr.id} user={usr} workspaceId={-1} />)
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
          <div style={{ margin: '10px' }}></div>
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
            <CreateUserButton></CreateUserButton>
          </div>
        </section>
      </div>
    </Suspense>
  )
}

export default Admin
