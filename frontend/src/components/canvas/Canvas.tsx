import { useRef, useState } from 'react'
import BBTool from './BBTool'

interface iCanvasTool {
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseUp: (e: React.MouseEvent) => void
  objectRep: () => React.CSSProperties
}

type CanvasObject = Rect | null

const colour = Array.from({ length: 100 }, (_, i) => `hsl(${i * 137.5}deg 70% 60%)`)
type Colour = (typeof colour)[number]

interface Coord {
  x: number
  y: number
}

interface Rect {
  id: number
  start: Coord
  end: Coord
  colour: Colour | null
}

const isRect = (obj: any): obj is Rect => {
  return obj !== null && 'id' in obj && 'start' in obj && 'end' in obj && 'colour' in obj
}

const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeObjects, setObjects] = useState<CanvasObject[]>([])
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
      <div style={activeTool.objectRep()} />
      {activeObjects.map((el: CanvasObject) => {
        if (el === null) return null
        if (isRect(el)) {
          const left = Math.min(el.start.x, el.end.x)
          const top = Math.min(el.start.y, el.end.y)
          const width = Math.abs(el.end.x - el.start.x)
          const height = Math.abs(el.end.y - el.start.y)
          const c = el.colour ?? (colour[el.id % colour.length])
          return (
            <div
              key={el.id}
              className="absolute border-2 pointer-events-none"
              style={{
                left,
                top,
                width,
                height,
                borderColor: c,
                backgroundColor: c.slice(0, -4) + '80% / 0.2)',
              }}
            ></div>
          )
        }
      })}
    </div>
  )
}

export default Canvas
export type { iCanvasTool, CanvasObject, Coord, Colour, Rect }
export { isRect }
