import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
// from usequeryhooks, import usegetallusers usecreatenewyuser, usedeleteuser

type AdminParams = {
  workspaceId: string
  imageId: number
  url: string
}

export function Admin() {
  const params: AdminParams = useParams({ from: Route.id })

  return (
    <div>
      Annotate Workspace: {params.workspaceId}, Image: {params.imageId}{' '}
    </div>
  )
  //TODO: create annotation page
}

export default Admin
