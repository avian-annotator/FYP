import Konva from 'konva'
import React, { RefObject } from 'react'
// currently selected objects OR cursor position
// objects being created
type CanvasState = {
  userState: UserState[]
  canvasElements: CanvasElement[]
}

type UserState = {
  userId: number
  currentSelectionId: number | undefined
  cursorPosition: Position
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
  userState: [],
  canvasElements: [],
} as CanvasState

type CanvasAction =
  | { type: 'addElement'; element: CanvasElement }
  | { type: 'removeElement'; id: number }
  | { type: 'setDragging'; userId: number; isDragging: boolean }
  | { type: 'addLabel'; id: number; label: string }
  | { type: 'setSelected'; userId: number; id: number }
  | { type: 'clearSelected'; userId: number }
  | { type: 'addUser'; userId: number } // NOT IMPLEMENTED
  | { type: 'removeUser'; userId: number } // NOT IMPLEMENTED

function canvasReducer(p: CanvasState, action: CanvasAction) {
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
    default:
      throw new Error()
  }
}

export default CanvasState
export type { UserState, CanvasElement, Position, CanvasAction, CanvasElementProps }
export { initalCanvasState, canvasReducer }
