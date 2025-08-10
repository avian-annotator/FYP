import { useState, useRef } from 'react'
import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'
import { Rect } from 'react-konva'
import { getColor, getBackgroundColor } from '../CanvasUtils'

const BoundingBoxTool = (props: CanvasToolProps): CanvasTool => {
  const [isDragging, setDragging] = useState(false)
  const stageRef = props.stageRef
  const rectRef = useRef<Konva.Rect>(null)

  const handleMouseDown = () => {
    // create konva rectangle
    setDragging(true)
    const pos = stageRef.current?.getPointerPosition()
    const rect = (
      <Rect
        x={pos?.x}
        y={pos?.y}
        width={0}
        height={0}
        ref={rectRef}
        stroke="#007bff"
        strokeWidth={2}
        fill="rgba(0, 123, 255, 0.1)"
        key={stageRef.current?.children[0].children.length ?? 0} //hard coded [0]
        id={`stage.${String(stageRef.current?.children[0].children.length ?? 0)}`}
      />
    )
    props.addToStage(rect)
  }

  const handleMouseMove = () => {
    // scale the konva rectangle
    const pos = stageRef.current?.getPointerPosition()
    //console.log(pos, isDragging)
    if (isDragging && rectRef.current) {
      rectRef.current.width((pos?.x ?? 0) - rectRef.current.x())
      rectRef.current.height((pos?.y ?? 0) - rectRef.current.y())
    }
  }

  const handleMouseUp = () => {
    // stop scaling and add colour
    if (isDragging && rectRef.current) {
      const id = Number(rectRef.current.id().slice(6))
      rectRef.current.fill(getBackgroundColor(id))
      rectRef.current.stroke(getColor(id))
    }
    setDragging(false)
  }

  return {
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
  } as CanvasTool
}
export default BoundingBoxTool
