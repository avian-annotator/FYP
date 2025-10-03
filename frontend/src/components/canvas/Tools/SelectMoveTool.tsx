import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

const userId = 0
const SelectMoveTool = (props: CanvasToolProps): CanvasTool => {
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target instanceof Konva.Shape) {
      const id = String(e.target.id())
      props.canvasDispatch({ type: 'setDragging', userId, isDragging: true })
      props.canvasDispatch({ type: 'setSelected', id, userId })
      e.target.draggable(true)
    } else {
      props.canvasDispatch({ type: 'setDragging', userId, isDragging: false })
      props.canvasDispatch({ type: 'clearSelected', userId })
    }
  }
  const toolName = 'SelectandMoveTool'

  return {
    handleMouseDown: () => {},
    handleMouseUp: () => {},
    handleMouseMove: () => {},
    handleClick,
    toolName: toolName,
  } as CanvasTool
}
export default SelectMoveTool
