import { useRef } from 'react'
import { CanvasTool, CanvasToolFunctionProps, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

const BoundingBoxTool = (props: CanvasToolProps): CanvasTool => {
  const stageRef = props.stageRef
  const rectRef = useRef<Konva.Rect>(null)

  const handleMouseDown = (funcProps: CanvasToolFunctionProps) => {
  }

  const handleMouseMove = (funcProps:CanvasToolFunctionProps) => {
  }

  const handleMouseUp = (funcProps:CanvasToolFunctionProps) => {
  }

  const toolName = "Select and Move Tool"

  return {
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
    toolName: toolName
  } as CanvasTool
}
export default BoundingBoxTool
