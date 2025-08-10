import { useRef, useState } from 'react'
import { JSX } from 'react/jsx-runtime'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import BoundingBoxTool from './Tools/BoundingBoxTool'

interface CanvasTool {
  handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void
  handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void
  handleMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => void
}

interface CanvasToolProps {
  stageRef: React.RefObject<Konva.Stage | null>
  addToStage: (el: JSX.Element) => void
}

const Canvas = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const [stageElements, setStageElements] = useState<JSX.Element[]>([])

  const addToStage = (el: JSX.Element) => {
    setStageElements(p => p.concat(el))
  }

  // add tool switcher
  const activeTool = BoundingBoxTool({
    stageRef: stageRef,
    addToStage: addToStage,
  })
  return (
    <div className="relative w-dvw h-dvh bg-[#f0f0f0] select-none border-black border-[1rem]">
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={activeTool.handleMouseDown}
        onMouseMove={activeTool.handleMouseMove}
        onMouseUp={activeTool.handleMouseUp}
      >
        <Layer>{stageElements}</Layer>
      </Stage>
    </div>
  )
}

export default Canvas

export type { CanvasTool, CanvasToolProps }
