import { useAuth } from '@/auth'
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp'
import { useRef, useEffect } from 'react'

export interface AnnotatePayload {
  actionType: string
  userId: number
  action: string
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
    if (!auth.userDetails) return
    message.userId = auth.userDetails.id
    rxStomp.publish({
      destination: `/app/workspace/${workspaceId}/image/${imageId}/annotate`,
      body: JSON.stringify(message),
    })
  }

  useEffect(() => {
    if (!auth.userDetails) return
    const userDetails = auth.userDetails

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
      action: '{}',
      actionType: 'join',
      userId: userDetails.id,
    }

    const leaveMessage: AnnotatePayload = {
      actionType: 'leave',
      action: '{}',
      userId: userDetails.id,
    }

    const connectedSub = rxStomp.connected$.subscribe(() => {
      JSON.stringify(joinMessage)
      publishAnnotationActions(joinMessage)
    })

    const annotateSub = rxStomp
      .watch(`/topic/workspace/${workspaceId}/image/${imageId}/annotate`)
      .subscribe(msg => {
        const message = JSON.parse(msg.body) as AnnotatePayload
        // Only call onReceiveAnnotation if the message is NOT from this client
        if (message.userId !== userDetails.id) {
          onReceiveAnnotation(message)
        }
      })

    const presenceSub = rxStomp
      .watch(`/topic/workspace/${workspaceId}/image/${imageId}/presence`)
      .subscribe(_ => {
        // optional
      })
    const handleBeforeUnload = () => {
      publishAnnotationActions(leaveMessage)
      connectedSub.unsubscribe()
      annotateSub.unsubscribe()
      presenceSub.unsubscribe()
      void rxStomp.deactivate()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      handleBeforeUnload()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [auth.userDetails])
  return { publishAnnotationActions }
}
