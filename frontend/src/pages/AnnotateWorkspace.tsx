import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar } from '@/components/workspace/ToolSelectorSidebar'
import { useState } from 'react'
import { useGeneratePresignedDownloadUrlForImage } from '../../generated'
import { Canvas } from '@/components/canvas'
import { Button } from '@/components/ui/button'
import CanvasExport from '@/components/canvas/CanvasExport'

export function AnnotateWorkspace() {
  const { workspaceId, imageId } = useParams({ from: Route.id })
  const [active, setActive] = useState<number>(0)

  const { data } = useGeneratePresignedDownloadUrlForImage(Number(workspaceId), imageId, {
    includeAnnotations: true,
  })
  const image = data?.data

  const handleDownload = () => {
    if (!canvasStateRef.current) {
      alert('No canvas state found.')
      return
    }
    const state = canvasStateRef.current.getState()
    const json = CanvasExport(state, 'COCOJSON')
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${image?.fileName.replace(/\.[^/.]+$/, '') || 'annotations'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Cleanup
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative flex flex-col items-center">
        <div className="flex flex-col items-center gap-4">
          <p>Currently editing: {image?.fileName}</p>
          {image?.url && (
            <Canvas image={image.url} tool={active} workspaceId={workspaceId} imageId={imageId} />
          )}
          <Button onClick={handleDownload}>Save Annotations</Button>
        </div>
        <div className="absolute left-full top-10 ml-2 flex flex-col justify-center">
          <ToolSelectorSidebar active={active} onSelect={setActive} />
        </div>
      </div>
    </div>
  )
}
export default AnnotateWorkspace
