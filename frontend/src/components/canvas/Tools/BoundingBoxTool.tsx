import { useRef } from 'react'
import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'
import { getColor, getBackgroundColor } from '../CanvasUtils'
import BoundingBox from '../Objects/BoundingBox'

const userId = 0

const BoundingBoxTool = (props: CanvasToolProps): CanvasTool => {
  const stageRef = props.stageRef
  const rectRef = useRef<Konva.Rect>(null)

  const handleMouseDown = (_: Konva.KonvaEventObject<MouseEvent>) => {
    // create konva rectangle
    props.canvasDispatch({ type: 'setDragging', userId: userId, isDragging: true })
    const pos = stageRef.current?.getPointerPosition()
    const id = stageRef.current?.children[0].children.length ?? 0 //hard coded [0]
    const rect = (
      <BoundingBox
        initialPos={{ x: pos?.x ?? 0, y: pos?.y ?? 0 }}
        ref={rectRef}
        id={id}
        color={getColor(id)}
      />
    )
    props.canvasDispatch({ type: 'addElement', element: rect })
  }

  const handleMouseMove = (_: Konva.KonvaEventObject<MouseEvent>) => {
    // scale the konva rectangle
    const pos = stageRef.current?.getPointerPosition()
    const user = props.canvasState.userState.find(user => user.userId === userId)
    if (user?.isDragging && rectRef.current) {
      rectRef.current.width((pos?.x ?? 0) - rectRef.current.x())
      rectRef.current.height((pos?.y ?? 0) - rectRef.current.y())
    }
  }

  const handleMouseUp = (_: Konva.KonvaEventObject<MouseEvent>) => {
    // stop scaling and add colour
    const user = props.canvasState.userState.find(user => user.userId === userId)
    if (user?.isDragging && rectRef.current) {
      const id = Number(rectRef.current.id().slice(6))
      rectRef.current.fill(getBackgroundColor(id))
      rectRef.current.stroke(getColor(id))
    }
    props.canvasDispatch({ type: 'setDragging', userId: userId, isDragging: false })
  }

  const toolName = 'Bounding Box Creator'

  return {
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
    toolName: toolName,
    handleClick: () => {},
  } as CanvasTool
}
export default BoundingBoxTool
