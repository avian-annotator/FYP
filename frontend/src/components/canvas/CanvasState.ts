import Konva from 'konva'
import { RefObject } from 'react'
import * as Y from 'yjs'

type UserState = {
  userId: number
  currentSelectionId?: number
  cursorPosition?: Position
  isDragging: boolean
}

interface CanvasElementProps {
  ref: RefObject<null | Konva.Shape>
  id: number
}

type CanvasElement = {
  id: number
  type: 'rectangle' | 'circle' | 'line'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any> //konva props
  startId?: number //for edges
  endId?: number
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

export function createCanvasState(): CanvasState {
  const ydoc = new Y.Doc()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = ydoc.getMap<Y.Array<any>>('canvasState')

  if (!map.has('userState')) {
    map.set('userState', new Y.Array<UserState>())
  }
  if (!map.has('canvasElements')) {
    map.set('canvasElements', new Y.Array<CanvasElement>())
  }

  return {
    ydoc,
    userState: map.get('userState') as Y.Array<UserState>,
    canvasElements: map.get('canvasElements') as Y.Array<CanvasElement>,
  }
}

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
  | { type: 'join'; update: string }
  | { type: 'leave' }

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
        console.log('label')
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
      //TODO: sort this out properly
      const yUpdate = Uint8Array.from(JSON.parse(action.update) as number[])
      Y.applyUpdate(canvasState.ydoc, yUpdate)
      break
    }
  }
}

export default CanvasState
export type { UserState, CanvasElement, Position, CanvasAction, CanvasElementProps }
export {}
