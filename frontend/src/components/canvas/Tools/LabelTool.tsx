import { useAuth } from '@/auth'
import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

const LabelTool = (props: CanvasToolProps): CanvasTool => {
  const userId = useAuth().userDetails?.id ?? 0

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const user = props.canvasState.userState.toArray().find(u => u.userId === userId)
    const element = props.canvasState.canvasElements
      .toArray()
      .find(el => el.id === user?.currentSelectionId)
    if (e.evt.button === 0) {
      if (e.target instanceof Konva.Shape) {
        const labelText = prompt('Enter label text:')
        if (labelText && labelText.trim()) {
          const shapeId = e.target.id().split('.')[1] //TODO: Make a function for this that the interface implements for any canvas object rect or otherwise

          const label = labelText.trim()

          props.canvasDispatch({ type: 'addLabel', id: shapeId, label: label })
        }
      }
    }
  }

  const toolName = 'LabelTool'

  return {
    handleMouseDown: () => {},
    handleMouseUp: () => {},
    handleMouseMove: () => {},
    handleClick: handleClick,
    toolName: toolName,
  } as CanvasTool
}

export default LabelTool
