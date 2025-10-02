import express from 'express'
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp'
import * as Y from 'yjs'
import { createCanvasState, yjsDispatch, type CanvasAction } from './canvas/CanvasState'
import { Client } from 'pg'
import { publishAnnotationActions, saveYjsToDB, updateYjsFromDB } from './repository'
import { interval } from 'rxjs'

/*
  Yes, this is a God file. Additional features should NOT be added, only bug fixes.
  If additional features are added, this needs to be rethought. The only purpose of this is to sync changes to the DB,
  as a client.
*/

// Init
const client = new Client({
  connectionString: Bun.env.DATASOURCE_URL,
})

const SIDECAR_ID = -1

try {
  await client.connect()
  console.log('Postgres client connected successfully!')
} catch (err) {
  console.error('Failed to connect to Postgres:', err)
}

const app = express()
const port = 3000

export interface AnnotatePayload {
  actionType: string
  userId: number
  action: string
}

export interface Session {
  ws: RxStomp
  ydoc: Y.Doc
}

const sessionClients: Record<string, Session> = {}
let sessionCookie: string | undefined

app.post('/session/workspace/:workspaceId/image/:imageId', (req, res) => {
  console.log('START')

  const { workspaceId, imageId } = req.params
  const key = `${workspaceId}/${imageId}`

  if (sessionClients[key]) {
    return res.status(200).send({ message: `STOMP client already exists for ${key}` })
  }

  const rxStomp = new RxStomp()

  const rxStompConfig: RxStompConfig = {
    webSocketFactory: () =>
      new WebSocket(`${Bun.env.WEBSOCKET_URL}/ws`, {
        headers: {
          Cookie: sessionCookie,
        },
      }),
    heartbeatIncoming: 0,
    heartbeatOutgoing: 0,
    reconnectDelay: 5000,
  }

  rxStomp.configure(rxStompConfig)
  rxStomp.activate()

  const canvasState = createCanvasState()
  const ydoc = canvasState.ydoc
  sessionClients[key] = { ws: rxStomp, ydoc }
  rxStomp.connected$.subscribe(() => {
    updateYjsFromDB({ client, imageId, ydoc }).then(() => {
      console.log(`STOMP client connected for ${key}`)
    })

    rxStomp.watch(`/topic/workspace/${workspaceId}/image/${imageId}/annotate`).subscribe(msg => {
      const message = JSON.parse(msg.body) satisfies AnnotatePayload
      if (message.actionType === 'join') {
        const yjsUpdate = Y.encodeStateAsUpdate(ydoc)

        const base64Update = Buffer.from(yjsUpdate).toString('base64')
        const action = {
          type: 'update',
          update: base64Update,
        }

        publishAnnotationActions({
          message: {
            actionType: 'update',
            userId: SIDECAR_ID,
            action: JSON.stringify(action),
          },
          rxStomp,
          workspaceId,
          imageId,
        })
      } else {
        if (
          message.actionType !== 'join' &&
          message.actionType !== 'leave' &&
          message.userId !== SIDECAR_ID
        ) {
          const action = JSON.parse(message.action) satisfies CanvasAction
          yjsDispatch(canvasState, action)
        }
      }
    })

    const interval$ = interval(5000)
    interval$.subscribe(_ => {
      const ydoc = sessionClients[key]?.ydoc

      if (ydoc) saveYjsToDB({ client, imageId, ydoc })
    })

    res.status(201).send({ message: `STOMP client started for ${key}` })
  })
})

app.delete('/session/workspace/:workspaceId/image/:imageId', (req, res) => {
  console.log('ends')
  const { workspaceId, imageId } = req.params
  const key = `${workspaceId}/${imageId}`

  const session = sessionClients[key]
  if (session) {
    session.ws.deactivate()
    delete sessionClients[key]
    console.log(`STOMP client stopped for ${key}`)
  }

  if (session) {
    saveYjsToDB({ client, imageId, ydoc: session.ydoc })
  }
  res.status(200).send({ message: `STOMP client stopped for ${key}` })
})

// Start up
async function loginSidecar(username: string, password: string): Promise<void> {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  const response = await fetch('http://backend:8080/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    redirect: 'manual',
  })

  if (!response.ok && response.status !== 302) {
    throw new Error(`Login failed: ${response.status}`)
  }

  // Capture Set-Cookie
  const rawCookie = response.headers.get('set-cookie')
  if (rawCookie) {
    sessionCookie = rawCookie.split(';')[0]
  }

  console.log('Sidecar logged in successfully. Cookie:', sessionCookie)
}

async function loginWithBackoff(username: string, password: string, maxRetries = 7) {
  let attempt = 0
  let delay = 1000

  while (attempt < maxRetries) {
    try {
      await loginSidecar(username, password)
      return
    } catch (err) {
      attempt++
      console.error(`Login attempt ${attempt} failed. Retrying in ${delay}ms...`)
      await new Promise(res => setTimeout(res, delay))
      delay *= 2
    }
  }

  console.error(`Failed to login after ${maxRetries} attempts`)
}

app.listen(port, async () => {
  console.log(`Sidecar running at http://localhost:${port}`)

  const USERNAME = Bun.env.SIDECAR_USERNAME || 'sidecar'
  const PASSWORD = Bun.env.SIDECAR_PASSWORD || 'sidecarpassword'

  await loginWithBackoff(USERNAME, PASSWORD)

  // Required to keep session alive
  setInterval(
    () => {
      loginSidecar(USERNAME, PASSWORD).catch(err => console.error('Periodic login failed:', err))
    },
    10 * 60 * 1000,
  )
})

// Clean up
const shutdown = () => {
  client.end().then(() => {
    console.log('Postgres client disconnected')
    process.exit(0)
  })
}

process.on('SIGINT', shutdown) // Ctrl+C
process.on('SIGTERM', shutdown) // kill signal
process.on('exit', shutdown)
