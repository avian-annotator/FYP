import { useParams } from '@tanstack/react-router'
import { Route } from '../routes/workspaces/$workspaceId/annotate/$imageId'
import { ToolSelectorSidebar } from '@/components/workspace/ToolSelectorSidebar'
import { useState } from 'react'
import { useGeneratePresignedDownloadUrlForImage } from '../../generated'
import { Canvas } from '@/components/canvas'
import { useEffect, useRef } from 'react'
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp'
import { useAuth } from '@/auth'
import { CanvasStateHandle } from '@/components/canvas/Canvas'
import { Button } from '@/components/ui/button'

interface AnnotatePayload {
  // THIS is just a placeholder for now
  annotationAction: string
  userId: number
  objectId: string
  objectType: string
  data?: string
}

// interface PresencePayload {
//   // THIS is just a placeholder for now
//   annotationAction: string
//   userId: number
//   objectId: string
//   objectType: string
// }

export function AnnotateWorkspace() {
  const { workspaceId, imageId } = useParams({ from: Route.id })
  const [active, setActive] = useState<number>(0)
  const auth = useAuth()
  const canvasStateRef = useRef<CanvasStateHandle>(null)

  const { data } = useGeneratePresignedDownloadUrlForImage(Number(workspaceId), imageId, {
    includeAnnotations: true,
  })
  const image = data?.data

  const rxStompRef = useRef(new RxStomp())
  const rxStomp = rxStompRef.current

  const publishAnnotationActions = (message: AnnotatePayload) => {
    rxStomp.publish({
      destination: `/app/workspace/${workspaceId}/image/${imageId}/annotate`,
      body: JSON.stringify(message),
    })
  }

  // const publishAnnotationPresence = (message: PresencePayload) => {
  //   rxStomp.publish({
  //     destination: `/app/workspace/${workspaceId}/image/${imageId}/presence`,
  //     body: JSON.stringify(message),
  //   })
  // }

  useEffect(() => {
    if (auth.userDetails === undefined) return

    const rxStompConfig: RxStompConfig = {
      brokerURL: `${import.meta.env.VITE_WEBSOCKET_URL as string}/ws`,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      reconnectDelay: 5000,
      // debug: (msg: string): void => {
      //   console.log(msg)
      // },
    }
    rxStomp.configure(rxStompConfig)
    rxStomp.activate()

    publishAnnotationActions({
      annotationAction: 'JOIN',
      userId: auth.userDetails.id,
      objectId: imageId,
      objectType: 'IMAGE',
    })

    const annotateObservable$ = rxStomp.watch(
      `/topic/workspace/${workspaceId}/image/${imageId}/annotate`,
    )
    const topicSubscription = annotateObservable$
      .subscribe
      //   msg => {
      //   // console.log(msg.body)

      // }
      ()

    const presenceObservable$ = rxStomp.watch(
      `/topic/workspace/${workspaceId}/image/${imageId}/presence`,
    )
    const presenceSubscription = presenceObservable$
      .subscribe
      //   msg => {
      //   // console.log(msg.body)

      // }
      ()

    return () => {
      topicSubscription.unsubscribe()
      presenceSubscription.unsubscribe()
      void rxStomp.deactivate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- some deps aren't required
  }, [auth.userDetails, workspaceId, imageId])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative flex flex-col items-center">
        <div className="flex flex-col items-center gap-4">
          <p>Currently editing: {image?.fileName}</p>
          {image?.url && <Canvas ref={canvasStateRef} image={image.url} tool={active} />}
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
