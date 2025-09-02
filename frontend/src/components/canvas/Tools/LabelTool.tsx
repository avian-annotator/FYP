import { CanvasTool, CanvasToolProps } from '../Canvas'
import { BoundingBoxLabel } from '../Objects/BoundingBox'
import Konva from 'konva'

type LabelToolFuncExtra = {
  handleCanvasSelect: (shape?: Konva.Shape) => void
  addLabelToBoundingBox: (boundingBoxId: number, label: BoundingBoxLabel) => void
}

const LabelTool = (_: CanvasToolProps): CanvasTool => {
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>, extra: LabelToolFuncExtra) => {
    if (e.evt.button === 0) {
      if (e.target instanceof Konva.Rect && e.target.id().startsWith('stage.')) {
        const labelText = prompt('Enter label text:')
        if (labelText && labelText.trim()) {
          const boundingBoxId = parseInt(e.target.id().replace('stage.', ''))

          const label: BoundingBoxLabel = {
            text: labelText.trim(),
            position: { x: 0, y: -20 },
          }

          extra.addLabelToBoundingBox(boundingBoxId, label)

          extra.handleCanvasSelect(e.target)
        }
      } else {
        extra.handleCanvasSelect()
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