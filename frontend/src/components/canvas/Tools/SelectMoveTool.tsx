import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

const userId = 0
const SelectMoveTool = (props: CanvasToolProps): CanvasTool => {
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // left click
    if (e.evt.button === 0) {
      if (e.target instanceof Konva.Node) {
        e.target.setDraggable(true)
        props.canvasDispatch({
          type: 'setSelected',
          id: Number(e.currentTarget.id().split('.')[1]),
          userId: userId,
        })
      } else {
        props.canvasDispatch({ type: 'clearSelected', userId: userId })
      }
    }
  }

  const toolName = 'Select and Move Tool'

  return {
    handleMouseDown: () => {},
    handleMouseUp: () => {},
    handleMouseMove: () => {},
    handleClick: handleClick,
    toolName: toolName,
  } as CanvasTool
}
export default SelectMoveTool
