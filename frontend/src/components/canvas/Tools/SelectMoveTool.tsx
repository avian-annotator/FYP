import { CanvasTool,  CanvasToolProps } from '../Canvas'
import Konva from 'konva'

type SelectMoveFuncExtra = {
  handleCanvasSelect: (shape?: Konva.Shape) => void
}

const SelectMoveTool = (_: CanvasToolProps): CanvasTool => {

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>, extra: SelectMoveFuncExtra) => {
    // left click
    if (e.evt.button === 0 ) {
      if (e.target instanceof Konva.Shape) {
        e.target.setDraggable(true)
        extra.handleCanvasSelect(e.target)
      } else {
        extra.handleCanvasSelect()
      }
    }
  }

  const toolName = "Select and Move Tool"

  return {
    handleMouseDown: ()=>{},
    handleMouseUp: ()=>{},
    handleMouseMove: ()=>{},
    handleClick: handleClick,
    toolName: toolName
  } as CanvasTool
}
export default SelectMoveTool
