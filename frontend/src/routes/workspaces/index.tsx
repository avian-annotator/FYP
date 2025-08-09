import { Button } from '@/components/ui/button'
import { getWorkspaces } from '@/components/workspace/getWorkspaces'
import WorkspaceCard from '@/components/workspace/WorkspaceCard'
import { Workspace } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  if (isLoading) return <div>Loading workspaces...</div>
  if (error) return <div>Error loading workspaces: {error.message}</div>

  const myWorkspaces = data || []
  return (
    <div className="max-w-4xl w-full mx-auto p-6 space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">My Workspaces</h2>
        <hr />
        <div className="space-y-2">
          {myWorkspaces.map((ws: Workspace) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
        <Button className="mt-4 text-green-600 bg-green-100 hover:bg-green-200" variant="ghost">
          Create new Workspace?
        </Button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Guest Workspaces</h2>
        <hr />
        <div className="space-y-2">
          {myWorkspaces.map((ws: Workspace) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
      </section>
      <Outlet />
    </div>
  )
}
