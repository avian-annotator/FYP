//import { useRef } from 'react'
import { CanvasTool, /* CanvasToolProps*/ } from '../Canvas'
//import Konva from 'konva'

const TemplateTool = ({/*props: CanvasToolProps*/}): CanvasTool => {
  //const stageRef = props.stageRef
  //const shapeRef = useRef<Konva.Shape>(null)

  const handleMouseDown = ({/*funcProps: CanvasToolFunctionProps*/}) => {
  }

  const handleMouseMove = ({/*funcProps:CanvasToolFunctionProps*/}) => {
  }

  const handleMouseUp = ({/*funcProps:CanvasToolFunctionProps*/}) => {
  }

  const handleClick = ({/*funcProps:CanvasToolFunctionProps*/}) => {

  }

  const toolName = "Template Tool"

  return {
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
    handleClick: handleClick,
    toolName: toolName
  } as CanvasTool
}
export default TemplateTool
