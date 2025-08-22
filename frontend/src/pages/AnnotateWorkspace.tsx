import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar, ToolId } from '@/components/workspace/ToolSelectorSidebar'
import { useState } from 'react'

type AnnotateWorkspaceParams = {
  workspaceId: string
  imageId: number
  url: string
}

export function AnnotateWorkspace() {
  const params: AnnotateWorkspaceParams = useParams({ from: Route.id })
  const [active, setActive] = useState<ToolId>('select')
  return (
    <div className="h-screen w-screen">
      <div className="flex justify-end pt-2 p-1">
        <ToolSelectorSidebar active={active} onSelect={setActive} />
      </div>
      <div className="flex items-center justify-center flex-col gap-1">
        {' '}
        <p>
          {' '}
          Workspace: {params.workspaceId}, Image: {params.imageId}
        </p>
        <p className="text-lg">
          Currently selected: <span className="font-semibold">{active}</span>
        </p>
      </div>
    </div>
  )
}
export default AnnotateWorkspace
