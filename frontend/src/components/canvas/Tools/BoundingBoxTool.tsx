import { useRef } from 'react'
import { CanvasTool, CanvasToolFunctionProps, CanvasToolProps } from '../Canvas'
import Konva from 'konva'
import { getColor, getBackgroundColor } from '../CanvasUtils'
import BoundingBox from '../Components/BoundingBox'

const BoundingBoxTool = (props: CanvasToolProps): CanvasTool => {
  const stageRef = props.stageRef
  const rectRef = useRef<Konva.Rect>(null)

  const handleMouseDown = (funcProps: CanvasToolFunctionProps) => {
    // create konva rectangle
    funcProps.dragging(true)
    const pos = stageRef.current?.getPointerPosition()
    const rect = <BoundingBox
      initialPos={{ x: pos?.x ?? 0, y: pos?.y ?? 0 }}
      ref={rectRef}
      id={stageRef.current?.children[0].children.length ?? 0} //hard coded [0]
    />
    props.addToStage(rect)
  }

  const handleMouseMove = (funcProps:CanvasToolFunctionProps) => {
    // scale the konva rectangle
    const pos = stageRef.current?.getPointerPosition()
    //console.log(pos, funcProps.dragging())
    if (funcProps.dragging() && rectRef.current) {
      rectRef.current.width((pos?.x ?? 0) - rectRef.current.x())
      rectRef.current.height((pos?.y ?? 0) - rectRef.current.y())
    }
  }

  const handleMouseUp = (funcProps:CanvasToolFunctionProps) => {
    // stop scaling and add colour
    if (funcProps.dragging() && rectRef.current) {
      const id = Number(rectRef.current.id().slice(6))
      rectRef.current.fill(getBackgroundColor(id))
      rectRef.current.stroke(getColor(id))
    }
    funcProps.dragging(false)
  }

  const toolName = "Bounding Box Creator"

  return {
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
    toolName: toolName
  } as CanvasTool
}
export default BoundingBoxTool
