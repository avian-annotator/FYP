import type { Client } from 'pg'
import * as Y from 'yjs'
import type { AnnotatePayload } from './app'
import type { RxStomp } from '@stomp/rx-stomp'

interface UpdateYjsFromDBProps {
  client: Client
  imageId: string
  ydoc: Y.Doc
}

interface PublishAnnotationActionsProps {
  message: AnnotatePayload
  rxStomp: RxStomp
  workspaceId: string
  imageId: string
}

interface SaveYjsToDBProps {
  client: Client
  imageId: string
  ydoc: Y.Doc
}

export const updateYjsFromDB = async ({ client, imageId, ydoc }: UpdateYjsFromDBProps) => {
  const res = await client.query('SELECT annotations FROM image i WHERE i.bucket_identifier = $1', [
    imageId,
  ])

  const binary = res.rows[0].annotations as Buffer // BYTEA comes back as Buffer
  Y.applyUpdate(ydoc, binary)
  return ydoc
}

export const saveYjsToDB = async ({ client, imageId, ydoc }: SaveYjsToDBProps) => {
  const binary = Y.encodeStateAsUpdate(ydoc)
  await client.query('UPDATE image SET annotations = $1 WHERE bucket_identifier = $2', [
    binary,
    imageId,
  ])
}

export const publishAnnotationActions = ({
  message,
  rxStomp,
  workspaceId,
  imageId,
}: PublishAnnotationActionsProps) => {
  rxStomp.publish({
    destination: `/app/workspace/${workspaceId}/image/${imageId}/annotate`,
    body: JSON.stringify(message),
  })
}
