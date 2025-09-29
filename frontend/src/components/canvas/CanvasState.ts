import Konva from 'konva'
import React, { RefObject } from 'react'
import { AnnotatePayload } from '@/annotate/useAnnotate'
// currently selected objects OR cursor position
// objects being created
type CanvasState = {
  userState: UserState[]
  canvasElements: CanvasElement[]
}

type UserState = {
  userId: number
  currentSelectionId?: number
  cursorPosition?: Position
  isDragging: boolean
}

interface CanvasElementProps {
  ref: RefObject<null | Konva.Shape>
  id: number
  label?: string
}

type CanvasElement = React.ReactElement<CanvasElementProps>

type Position = {
  x: number
  y: number
}

const initalCanvasState = {
  userState: [{ userId: 0, isDragging: false }],
  canvasElements: [],
} as CanvasState

type CanvasAction =
  | { type: 'addElement'; element: CanvasElement }
  | { type: 'removeElement'; id: number }
  | { type: 'setDragging'; userId: number; isDragging: boolean }
  | { type: 'addLabel'; id: number; label: string }
  | { type: 'setSelected'; userId: number; id: number }
  | { type: 'clearSelected'; userId: number }
  | { type: 'addUser'; userId: number }
  | { type: 'removeUser'; userId: number } // NOT IMPLEMENTED
  | { type: 'join' }
  | { type: 'leave' }

function canvasReducer(p: CanvasState, action: CanvasAction) {
  // Don't publish if this is coming from websocket (handled in Canvas.tsx)
  switch (action.type) {
    case 'addElement':
      return { ...p, canvasElements: [...p.canvasElements, action.element] }
    case 'removeElement':
      return { ...p, canvasElements: p.canvasElements.filter(el => el.props.id !== action.id) }
    case 'addLabel':
      return {
        ...p,
        canvasElements: p.canvasElements.map(el =>
          el.props.id === action.id ? React.cloneElement(el, { label: action.label }) : el,
        ),
      }
    case 'setSelected':
      return {
        ...p,
        userState: p.userState.map(el =>
          el.userId === action.userId ? { ...el, currentSelectionId: action.id } : el,
        ),
      }
    case 'clearSelected':
      return {
        ...p,
        userState: p.userState.map(el =>
          el.userId === action.userId ? { ...el, currentSelectionId: undefined } : el,
        ),
      }
    case 'setDragging':
      return {
        ...p,
        userState: p.userState.map(el =>
          el.userId === action.userId ? { ...el, isDragging: action.isDragging } : el,
        ),
      }
    case 'addUser':
      return {
        ...p,
        userState:
          p.userState.find(user => user.userId) === undefined
            ? p.userState.concat({ userId: action.userId, isDragging: false })
            : p.userState,
      }
    case 'join':
      return p
    case 'leave':
      return p
    default:
      throw new Error()
  }
}

export default CanvasState
export type { UserState, CanvasElement, Position, CanvasAction, CanvasElementProps }
export { initalCanvasState, canvasReducer }
