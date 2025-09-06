import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar } from '@/components/workspace/ToolSelectorSidebar'
import { useState } from 'react'
import { useGeneratePresignedDownloadUrlForImage } from '../../generated'
import { Canvas } from '@/components/canvas'

type AnnotateWorkspaceParams = {
  workspaceId: number
  imageId: string
}

export function AnnotateWorkspace() {
  const params: AnnotateWorkspaceParams = useParams({ from: Route.id })
  const [active, setActive] = useState<number>(0)

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
        <p>
          Workspace: {image?.workspaceId}, Image: {image?.fileName}
        </p>
        {image?.url && <Canvas image={image.url} tool={active} />}
      </div>
    </div>
  )
}
export default AnnotateWorkspace
