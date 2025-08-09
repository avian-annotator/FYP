import { User } from '@/lib/types'

export async function getWorkspaceUsers(workspaceId: number): Promise<User[]> {
  const workspaceIdStr = String(workspaceId)
  const res = await fetch(`/api/workspaces/${workspaceIdStr}/users`)
  if (!res.ok) {
    throw new Error(`Failed to fetch users for workspace ${workspaceIdStr}`)
  }
  const data = (await res.json()) as User[]
  return data
}
