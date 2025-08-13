import { PaginationResponse } from '@/lib/types'

export async function fetchImages(workspaceId: string, page: number): Promise<PaginationResponse> {
  //TODO: add in hooks when they come out
  const res = await fetch(`/api/workspaces/${workspaceId}/images?page=${String(page - 1)}&size=8`)
  if (!res.ok) throw new Error('Failed to fetch images')
  const data = (await res.json()) as PaginationResponse
  return data
}
