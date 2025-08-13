import { Workspace } from '@/lib/types'

export async function getWorkspaces(): Promise<Workspace[]> {
  //TODO: add in hooks when they come out

  const res = await fetch(`/api/workspaces/`)
  if (!res.ok) {
    throw new Error(`Failed to fetch workspaces`)
  }

  const data = (await res.json()) as Workspace[]
  return data
}
