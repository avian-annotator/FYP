import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar } from '@/components/workspace/ToolSelectorSidebar'
import { useState } from 'react'
import { useGeneratePresignedDownloadUrlForImage } from '../../generated'
import { Canvas } from '@/components/canvas'
import { RecoilRoot } from 'recoil'

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
    <RecoilRoot>
      <div className="flex h-screen items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="flex flex-col items-center gap-4">
            <p>Currently editing: {image?.fileName}</p>
            {image?.url && <Canvas image={image.url} tool={active} />}
          </div>

          <div className="absolute left-full top-10 ml-2 flex flex-col justify-center">
            <ToolSelectorSidebar active={active} onSelect={setActive} />
          </div>
        </div>
      </div>
    </RecoilRoot>
  )
}
export default AnnotateWorkspace
