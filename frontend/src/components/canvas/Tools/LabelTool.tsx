import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'

type LabelToolFuncExtra = {
  addLabelToBoundingBox: (boundingBoxId: number, label: string) => void
}

const LabelTool = (_: CanvasToolProps): CanvasTool => {
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>, extra: LabelToolFuncExtra) => {
    if (e.evt.button === 0) {
      if (e.target instanceof Konva.Rect && e.target.id().startsWith('stage.')) {
        const labelText = prompt('Enter label text:')
        if (labelText && labelText.trim()) {
          const boundingBoxId = parseInt(e.target.id().replace('stage.', ''))

          const label = labelText.trim()

          extra.addLabelToBoundingBox(boundingBoxId, label)
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
export type { LabelToolFuncExtra }
