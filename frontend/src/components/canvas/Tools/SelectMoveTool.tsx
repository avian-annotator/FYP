import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

const userId = 0
const SelectMoveTool = (props: CanvasToolProps): CanvasTool => {
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // left click
    if (e.evt.button === 0) {
      if (e.target instanceof Konva.Shape) {
        props.canvasDispatch({
          type: 'setSelected',
          id: Number(e.target.id().split('.')[1]), //TODO: Make a function for this that the interface implements for any canvas object rect or otherwise
          userId: userId,
        })
        e.target.setDraggable(true)
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
