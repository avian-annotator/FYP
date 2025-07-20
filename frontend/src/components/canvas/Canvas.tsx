import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { JSX } from 'react/jsx-runtime'
import { canvasObjects, isCanvasObject, isCanvasToolMarker } from './CanvasUtils'
import BBTool from './Tools/BBTool'

interface CanvasTool {
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseUp: (e: React.MouseEvent) => void
  markerElement: () => JSX.Element
  markerId: number
}

interface CanvasToolProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  setCanvasObjects: Dispatch<SetStateAction<canvasObjects[]>>
}

const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeObjects, setObjects] = useState<canvasObjects[]>([])
  // add tool switcher
  const activeTool = BBTool({
    containerRef: containerRef,
    setCanvasObjects: setObjects,
  })

  return (
    <div
      ref={containerRef}
      onMouseDown={activeTool.handleMouseDown}
      onMouseMove={activeTool.handleMouseMove}
      onMouseUp={activeTool.handleMouseUp}
      className="relative w-full h-full bg-[#f0f0f0] select-none"
    >
      {/* <div style={activeTool.objectRep()} /> Put a active tool representative here*/}
      {activeObjects.map((el: canvasObjects) => {
        if (el === null) return null
        if (isCanvasToolMarker(el)) return activeTool.markerElement()
        if (isCanvasObject(el)) return el.getCanvasObjectElement()
      })}
    </div>
  )
}

export default Canvas

export type { CanvasTool, CanvasToolProps }
