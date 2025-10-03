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
  console.log('trying to update local yjs from db')

  if (
    res.rows.length > 0 &&
    res.rows[0].annotations instanceof Buffer &&
    res.rows[0].annotations.length > 0
  ) {
    const binary = res.rows[0].annotations as Buffer
    const uint8Array = new Uint8Array(binary)
    Y.applyUpdate(ydoc, uint8Array)
    console.log('Successfully fetched annotations from DB, updating local Yjs document.')
  } else {
    console.log('No valid annotations found in DB, skipping Yjs update.')
  }
}

export const saveYjsToDB = async ({ client, imageId, ydoc }: SaveYjsToDBProps) => {
  console.log('Saving yjs to db')
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
