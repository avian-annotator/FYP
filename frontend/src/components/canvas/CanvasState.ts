import Konva from 'konva'
import { RefObject } from 'react'
import * as Y from 'yjs'

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

type CanvasElement = {
  id: number
  type: 'rectangle' | 'circle' | 'line'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any> //konva props
  startId?: number //for edges
  endId?: number
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'updateElement'; id: number; props: Partial<Record<string, any>> }
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
    case 'addElement': {
      return { ...p, canvasElements: [...p.canvasElements, action.element] }
    }
    case 'updateElement': {
      return {
        ...p,
        canvasElements: p.canvasElements.map(el =>
          el.id === action.id ? { ...el, props: { ...el.props, ...action.props } } : el,
        ),
      }
    }
    case 'removeElement': {
      return { ...p, canvasElements: p.canvasElements.filter(el => el.id !== action.id) }
    }
    case 'addLabel': {
      return {
        ...p,
        canvasElements: p.canvasElements.map(el =>
          el.id === action.id ? { ...el, label: action.label } : el,
        ),
      }
    }
    case 'setSelected': {
      const hasUser = p.userState.some(user => user.userId === action.userId)
      return {
        ...p,
        userState: hasUser
          ? p.userState.map(user =>
              user.userId === action.userId ? { ...user, currentSelectionId: action.id } : user,
            )
          : [
              ...p.userState,
              { userId: action.userId, currentSelectionId: action.id, isDragging: false },
            ],
      }
    }
    case 'clearSelected': {
      const hasUserClear = p.userState.some(user => user.userId === action.userId)
      return {
        ...p,
        userState: hasUserClear
          ? p.userState.map(user =>
              user.userId === action.userId ? { ...user, currentSelectionId: undefined } : user,
            )
          : [
              ...p.userState,
              { userId: action.userId, currentSelectionId: undefined, isDragging: false },
            ],
      }
    }
    case 'setDragging': {
      return {
        ...p,
        userState: p.userState.map(el =>
          el.userId === action.userId ? { ...el, isDragging: action.isDragging } : el,
        ),
      }
    }
    case 'addUser': {
      return {
        ...p,
        userState:
          p.userState.find(user => user.userId) === undefined
            ? p.userState.concat({ userId: action.userId, isDragging: false })
            : p.userState,
      }}
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
