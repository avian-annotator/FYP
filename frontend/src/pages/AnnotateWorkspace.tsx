import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar, ToolId } from '@/components/workspace/ToolSelectorSidebar'
import { useState } from 'react'
import { useGeneratePresignedDownloadUrlForImage } from '../../generated'

type AnnotateWorkspaceParams = {
  workspaceId: number
  imageId: string
}

export function AnnotateWorkspace() {
  const params: AnnotateWorkspaceParams = useParams({ from: Route.id })
  const [active, setActive] = useState<ToolId>('select')

  const { data } = useGeneratePresignedDownloadUrlForImage(params.workspaceId, params.imageId, {
    includeAnnotations: true,
  })
  const image = data?.data

  return (
    <div className="h-screen w-screen">
      <div className="flex justify-end pt-2 p-1">
        <ToolSelectorSidebar active={active} onSelect={setActive} />
      </div>
      <div className="flex items-center justify-center flex-col gap-1">
        {' '}
        <p>
          {' '}
          Workspace: {image?.workspaceId}, Image: {image?.fileName}
        </p>
        <img src={image?.url}></img>
        <p className="text-lg">
          Currently selected: <span className="font-semibold">{active}</span>
        </p>
      </div>
    </div>
  )
}
export default AnnotateWorkspace
