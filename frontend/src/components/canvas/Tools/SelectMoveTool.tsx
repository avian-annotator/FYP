import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

const userId = 0
const SelectMoveTool = (props: CanvasToolProps): CanvasTool => {

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log("SelectMoveTool mouse down");

    if (e.target instanceof Konva.Shape && !(e.target instanceof Konva.Line)) {
      const id = Number(e.target.id());
      console.log("Selecting id", id);
      props.canvasDispatch({type: 'setDragging', userId, isDragging:true})
      props.canvasDispatch({ type: "setSelected", id, userId });
      e.target.draggable(true);
    } else {
      props.canvasDispatch({type: 'setDragging', userId, isDragging:false})
      props.canvasDispatch({ type: "clearSelected", userId });
    }
  };
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target instanceof Konva.Shape) {
      const id = Number(e.target.id())
      props.canvasDispatch({ type: 'setSelected', id, userId: userId })
      e.target.draggable(true)
    } else {
      props.canvasDispatch({ type: 'clearSelected', userId: userId })
    }
  }
  const toolName = 'Select and Move Tool'

  return {
    handleMouseDown: () => {},
    handleMouseUp: () => {},
    handleMouseMove: () => {},
    handleClick,
    toolName: toolName,
  } as CanvasTool
}
export default SelectMoveTool
