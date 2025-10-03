import Konva from 'konva'
import { RefObject } from 'react'
import * as Y from 'yjs'
import { Buffer } from 'buffer'

type UserState = {
  userId: number
  currentSelectionId?: string
  cursorPosition?: Position
  isDragging: boolean
}

interface CanvasElementProps {
  ref: RefObject<null | Konva.Shape>
  id: number
}

type CanvasElement = {
  id: string
  type: 'rectangle' | 'circle' | 'line'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any> //konva props
  startId?: string //for edges
  endId?: string
  label?: string // labels
}

type Position = {
  x: number
  y: number
}

export interface CanvasState {
  ydoc: Y.Doc
  userState: Y.Array<UserState>
  canvasElements: Y.Array<CanvasElement>
}

export function createCanvasState(ydoc: Y.Doc): CanvasState {
  return {
    ydoc,
    userState: ydoc.getArray<UserState>('userState'),
    canvasElements: ydoc.getArray<CanvasElement>('canvasElements'),
  }
}

type CanvasAction =
  | { type: 'addElement'; element: CanvasElement }
  | { type: 'removeElement'; id: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'updateElement'; id: string; props: Partial<Record<string, any>> }
  | { type: 'setDragging'; userId: number; isDragging: boolean }
  | { type: 'addLabel'; id: string; label: string }
  | { type: 'setSelected'; userId: number; id: string }
  | { type: 'clearSelected'; userId: number }
  | { type: 'addUser'; userId: number }
  | { type: 'removeUser'; userId: number } // NOT IMPLEMENTED
  | { type: 'join' }
  | { type: 'leave' }
  | { type: 'update'; update: string }

export function yjsDispatch(canvasState: CanvasState, action: CanvasAction) {
  const canvasElements = canvasState.canvasElements
  const userState = canvasState.userState

  switch (action.type) {
    case 'addElement':
      canvasElements.push([action.element])

      break

    case 'updateElement': {
      const index = canvasElements.toArray().findIndex(el => el.id === action.id)
      if (index >= 0) {
        const element = {
          ...canvasElements.get(index),
          props: { ...canvasElements.get(index).props, ...action.props },
        }
        canvasElements.delete(index, 1)
        canvasElements.insert(index, [element])
      }
      break
    }

    case 'removeElement': {
      const index = canvasElements.toArray().findIndex(el => el.id === action.id)
      if (index >= 0) canvasElements.delete(index, 1)
      break
    }

    case 'addLabel': {
      const index = canvasElements.toArray().findIndex(el => el.id === action.id)
      if (index >= 0) {
        const element = { ...canvasElements.get(index), label: action.label }
        canvasElements.delete(index, 1)
        canvasElements.insert(index, [element])
      }
      break
    }

    case 'setSelected': {
      const index = userState.toArray().findIndex(u => u.userId === action.userId)
      if (index >= 0) {
        const user = { ...userState.get(index), currentSelectionId: action.id }
        userState.delete(index, 1)
        userState.insert(index, [user])
      } else {
        userState.push([
          { userId: action.userId, currentSelectionId: action.id, isDragging: false },
        ])
      }
      break
    }

    case 'clearSelected': {
      const index = userState.toArray().findIndex(u => u.userId === action.userId)
      if (index >= 0) {
        const user = { ...userState.get(index), currentSelectionId: undefined }
        userState.delete(index, 1)
        userState.insert(index, [user])
      } else {
        userState.push([
          { userId: action.userId, currentSelectionId: undefined, isDragging: false },
        ])
      }
      break
    }

    case 'setDragging': {
      const index = userState.toArray().findIndex(u => u.userId === action.userId)
      if (index >= 0) {
        const user = { ...userState.get(index), isDragging: action.isDragging }
        userState.delete(index, 1)
        userState.insert(index, [user])
      } else {
        userState.push([{ userId: action.userId, isDragging: action.isDragging }])
      }
      break
    }

    case 'addUser': {
      const exists = userState.toArray().some(u => u.userId === action.userId)
      if (!exists) userState.push([{ userId: action.userId, isDragging: false }])
      break
    }

    case 'join': {
      // Presence shit probably
      break
    }

    case 'update': {
      const yUpdate = Buffer.from(action.update, 'base64')
      Y.applyUpdate(canvasState.ydoc, new Uint8Array(yUpdate))
      break
    }
  }
}

export default CanvasState
export type { UserState, CanvasElement, Position, CanvasAction, CanvasElementProps }
export {}
