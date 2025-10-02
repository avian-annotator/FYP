import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar } from '@/components/workspace/ToolSelectorSidebar'
import { useRef, useState } from 'react'
import { useGeneratePresignedDownloadUrlForImage } from '../../generated'
import { Canvas } from '@/components/canvas'
import { CanvasStateHandle } from '@/components/canvas/Canvas'
import { Button } from '@/components/ui/button'

export function AnnotateWorkspace() {
  const { workspaceId, imageId } = useParams({ from: Route.id })
  const [active, setActive] = useState<number>(0)

  const { data } = useGeneratePresignedDownloadUrlForImage(Number(workspaceId), imageId, {
    includeAnnotations: true,
  })
  const image = data?.data

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative flex flex-col items-center">
        <div className="flex flex-col items-center gap-4">
          <p>Currently editing: {image?.fileName}</p>
          {image?.url && (
            <Canvas image={image.url} tool={active} workspaceId={workspaceId} imageId={imageId} />
          )}
          <Button>Save Annotations</Button>
        </div>
        <div className="absolute left-full top-10 ml-2 flex flex-col justify-center">
          <ToolSelectorSidebar active={active} onSelect={setActive} />
        </div>
      </div>
    </div>
  )
}
export default AnnotateWorkspace
