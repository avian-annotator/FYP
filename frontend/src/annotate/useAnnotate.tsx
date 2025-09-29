import { useAuth } from '@/auth'
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp'
import { useRef, useEffect } from 'react'

interface AnnotatePayload {
  // THIS is just a placeholder for now
  annotationAction: string
  userId: number
  objectId: string
  objectType: string
}

// interface PresencePayload {
//   // THIS is just a placeholder for now
//   annotationAction: string
//   userId: number
//   objectId: string
//   objectType: string
// }

interface UseAnnotateProps {
  workspaceId: string
  imageId: string
  onReceiveAnnotation: (message: AnnotatePayload) => void
}

export const useAnnotate = ({ workspaceId, imageId, onReceiveAnnotation }: UseAnnotateProps) => {
  const auth = useAuth()

  const rxStompRef = useRef(new RxStomp())
  const rxStomp = rxStompRef.current

  const publishAnnotationActions = (message: AnnotatePayload) => {
    rxStomp.publish({
      destination: `/app/workspace/${workspaceId}/image/${imageId}/annotate`,
      body: JSON.stringify(message),
    })
  }

  useEffect(() => {
    if (!auth.userDetails) return

    const rxStompConfig: RxStompConfig = {
      brokerURL: `${import.meta.env.VITE_WEBSOCKET_URL as string}/ws`,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      reconnectDelay: 5000,
      debug: _ => {},
    }

    rxStomp.configure(rxStompConfig)
    rxStomp.activate()

    const joinMessage: AnnotatePayload = {
      annotationAction: 'JOIN',
      userId: auth.userDetails.id,
      objectId: '1',
      objectType: 'IMAGE',
    }

    const connectedSub = rxStomp.connected$.subscribe(() => {
      publishAnnotationActions(joinMessage)
    })

    const annotateSub = rxStomp
      .watch(`/topic/workspace/${workspaceId}/image/${imageId}/annotate`)
      .subscribe(msg => {
        const message = JSON.parse(msg.body) as AnnotatePayload
        onReceiveAnnotation(message)
      })

    const presenceSub = rxStomp
      .watch(`/topic/workspace/${workspaceId}/image/${imageId}/presence`)
      .subscribe(msg => {
        // optional
      })

    return () => {
      connectedSub.unsubscribe()
      annotateSub.unsubscribe()
      presenceSub.unsubscribe()
      void rxStomp.deactivate()
    }
  }, [])
  return { publishAnnotationActions }
}
