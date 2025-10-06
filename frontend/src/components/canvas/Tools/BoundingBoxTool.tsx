import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'
import { getColor, getBackgroundColor } from '../CanvasUtils'
import { CanvasElement } from '../CanvasState'
import { useAuth } from '@/auth'

const BoundingBoxTool = (props: CanvasToolProps): CanvasTool => {
  const userId = useAuth().userDetails?.id ?? 0

  const stageRef = props.stageRef

  const handleMouseDown = (_: Konva.KonvaEventObject<MouseEvent>) => {
    // create konva rectangle
    props.canvasDispatch({ type: 'setDragging', userId: userId, isDragging: true })

    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    const elementId = crypto.randomUUID()
    const id = `${String(userId)}_${elementId}`

    const rect: CanvasElement = {
      id,
      type: 'rectangle',
      props: {
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: getColor(props.canvasState.canvasElements.length),
        strokeWidth: 2,
        fill: getBackgroundColor(props.canvasState.canvasElements.length),
      },
    }
    props.canvasDispatch({ type: 'setSelected', userId: userId, id: id })
    props.canvasDispatch({ type: 'addElement', element: rect })
    props.canvasDispatch({ type: 'setDragging', userId: userId, isDragging: true })
  }

  const handleMouseMove = (_: Konva.KonvaEventObject<MouseEvent>) => {
    // scale the konva rectangle
    const pos = props.stageRef.current?.getPointerPosition()
    const user = props.canvasState.userState.toArray().find(u => u.userId === userId)
    const element = props.canvasState.canvasElements
      .toArray()
      .find(el => el.id === user?.currentSelectionId)

    if (user?.isDragging && element) {
      props.canvasDispatch({
        type: 'updateElement',
        id: element.id,
        props: {
          ...element.props,
          width: (pos?.x ?? 0) - element.props.x,
          height: (pos?.y ?? 0) - element.props.y,
        },
      })
    }
  }

  const handleMouseUp = (_: Konva.KonvaEventObject<MouseEvent>) => {
    // stop scaling and add colour
    props.canvasDispatch({ type: 'setDragging', userId: userId, isDragging: false })
    props.canvasDispatch({ type: 'clearSelected', userId: userId })
  }

  const toolName = 'Bounding Box Creator'

  return {
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
    toolName: toolName,
  } as CanvasTool
}
export default BoundingBoxTool
