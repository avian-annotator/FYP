import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar } from '@/components/workspace/ToolSelectorSidebar'
import { useState } from 'react'
import { useGeneratePresignedDownloadUrlForImage } from '../../generated'
import { Canvas } from '@/components/canvas'
import { useEffect, useRef } from 'react'
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp'

type AnnotateWorkspaceParams = {
  workspaceId: number
  imageId: string
interface AnnotatePayload {
  // THIS is just a placeholder for now
  annotationAction: string
  userId: number
  objectId: string
  objectType: string
}

export function AnnotateWorkspace() {
  const { workspaceId, imageId } = useParams({ from: Route.id })
  const [active, setActive] = useState<number>(0)

  const { data } = useGeneratePresignedDownloadUrlForImage(workspaceId, imageId, {
    includeAnnotations: true,
  })
  const image = data?.data
  const { workspaceId, imageId } = useParams({ from: Route.id })

  const rxStompRef = useRef(new RxStomp())
  const rxStomp = rxStompRef.current

  const publish = (message: AnnotatePayload) => {
    rxStomp.publish({
      destination: `/app/workspace/${workspaceId}/image/${imageId}/annotate`,
      body: JSON.stringify(message),
    })
  }

  useEffect(() => {
    const rxStompConfig: RxStompConfig = {
      brokerURL: `${import.meta.env.VITE_WEBSOCKET_URL as string}/ws`,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      reconnectDelay: 5000,
    }
    rxStomp.configure(rxStompConfig)
    rxStomp.activate()

    publish({ annotationAction: 'JOIN', userId: 1, objectId: '1', objectType: 'IMAGE' })

    const topicObservable$ = rxStomp.watch(
      `/topic/workspace/${workspaceId}/image/${imageId}/annotate`,
    )
    const topicSubscription = topicObservable$.subscribe(msg => {})

    return () => {
      topicSubscription.unsubscribe()
      void rxStomp.deactivate()
    }

    // Runs only once on mount, so don't need any dep arrays. They're also static anyways
  }, [])

  return (
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
  )
}
export default AnnotateWorkspace
