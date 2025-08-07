import { Button } from '@/components/ui/button'
import WorkspaceCard from '@/components/workspace/WorkspaceCard'
import { Workspace } from '@/lib/types'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/')({
  component: RouteComponent,
})

const test: Workspace[] = [
  { id: '1', name: 'test', owner: 'owner' },
  { id: '2', name: 'test', owner: 'owner' },
]

function RouteComponent() {
  return (
    <div className="max-w-4xl w-full mx-auto p-6 space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">My Workspaces</h2>
        <hr />
        <div className="space-y-2">
          {test.map(ws => (
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
          {test.map(ws => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
      </section>
      <Outlet />
    </div>
  )
}
