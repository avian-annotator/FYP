import Konva from 'konva'
import { Circle } from 'react-konva'
import { RefObject, useState } from 'react'
import { CanvasElementProps } from '../CanvasState'
import { getColor } from '../CanvasUtils'

interface KeypointProps extends CanvasElementProps {
  initialPos: { x: number; y: number }
  ref: RefObject<null | Konva.Circle>
  color?: string
  radius?: number
  onMove?: (x: number, y: number) => void
}

const Keypoint = (props: KeypointProps) => {
  const [pos, setPos] = useState<{ x: number; y: number }>(props.initialPos)
  const color = props.color || getColor(props.id)
  const radius = props.radius ?? 5

  return (
    <Circle
      x={pos.x}
      y={pos.y}
      radius={radius}
      ref={props.ref}
      stroke={color}
      fill={color}
      key={props.id}
      id={`point.${String(props.id)}`}
      draggable
      onDragMove={e => {
        const { x, y } = e.target.position()
        setPos({ x, y })
        props.onMove?.(x, y)
      }}
      onMouseUp={e => {
        const { x, y } = e.target.position()
        setPos({ x, y })
        props.onMove?.(x, y)
      }}
    />
  )
}

export default Keypoint
export type { KeypointProps }
