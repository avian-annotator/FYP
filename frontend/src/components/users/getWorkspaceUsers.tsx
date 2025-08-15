import { UserResponseDTO } from '../../../generated'

export async function getWorkspaceUsers(workspaceId: number): Promise<UserResponseDTO[]> {
  //TODO: delete and replace with generated hooks

  const workspaceIdStr = String(workspaceId)
  const res = await fetch(`/api/workspaces/${workspaceIdStr}/users`)
  if (!res.ok) {
    throw new Error(`Failed to fetch users for workspace ${workspaceIdStr}`)
  }
  const data = (await res.json()) as UserResponseDTO[]
  return data
}
