import { PaginationResponse } from '@/lib/types'

export async function fetchImages(workspaceId: number, page: number): Promise<PaginationResponse> {
  //TODO: delete and replace with generated
  const res = await fetch(
    `/api/workspaces/${String(workspaceId)}/images?page=${String(page - 1)}&size=8`,
  )
  if (!res.ok) throw new Error('Failed to fetch images')
  const data = (await res.json()) as PaginationResponse
  return data
}
