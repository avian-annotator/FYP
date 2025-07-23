import { JSX } from 'react'

const canvasColour = Array.from({ length: 100 }, (_, i) => `hsl(${String(i * 137.5)}deg 70% 60%)`)
type CanvasColour = (typeof canvasColour)[number]

interface Coord {
  x: number
  y: number
}

interface CanvasObject {
  getCanvasObjectElement: () => JSX.Element
}

const isCanvasObject = (obj: unknown): obj is CanvasObject => {
  return typeof obj === 'object' && obj !== null && 'getCanvasObjectElement' in obj
}

interface CanvasToolMarker {
  markerId: number
}

const isCanvasToolMarker = (obj: unknown): obj is CanvasToolMarker => {
  return typeof obj === 'object' && obj !== null && 'markerId' in obj
}

type canvasObjects = CanvasToolMarker | CanvasObject | null

export { canvasColour, isCanvasObject, isCanvasToolMarker }

export type { CanvasColour, CanvasObject, canvasObjects, CanvasToolMarker, Coord }
