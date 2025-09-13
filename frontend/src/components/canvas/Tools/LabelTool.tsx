import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

const LabelTool = (props: CanvasToolProps): CanvasTool => {
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 0) {
      if (e.target instanceof Konva.Shape) {
        const labelText = prompt('Enter label text:')
        if (labelText && labelText.trim()) {
          const boundingBoxId = Number(e.target.id().split('.')[1]) //TODO: Make a function for this that the interface implements for any canvas object rect or otherwise

          const label = labelText.trim()

          props.canvasDispatch({ type: 'addLabel', id: boundingBoxId, label: label })
        }
      }
    }
  }

  const toolName = 'Label Tool'

  return {
    handleMouseDown: () => {},
    handleMouseUp: () => {},
    handleMouseMove: () => {},
    handleClick: handleClick,
    toolName: toolName,
  } as CanvasTool
}

export default LabelTool
