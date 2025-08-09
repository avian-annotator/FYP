import { Workspace } from '@/lib/types'

export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await fetch(`/api/workspaces/`)
  if (!res.ok) {
    throw new Error(`Failed to fetch workspaces`)
  }

  const data = (await res.json()) as Workspace[]
  return data
}
