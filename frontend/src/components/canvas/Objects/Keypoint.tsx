import Konva from 'konva'
import { Circle, Text } from 'react-konva'
import { RefObject, useState } from 'react'
import { CanvasElementProps } from '../CanvasState'

interface KeypointProps extends CanvasElementProps {
  initialPos: { x: number; y: number }
  ref: RefObject<null | Konva.Circle>
  color?: string
  onMove?: (x: number, y: number) => void
}

const Keypoint = (props: KeypointProps) => {
  const [pos, setPos] = useState<{ x: number; y: number }>(props.initialPos)
  const color = 'red'

  return (
    <>
      <Circle
        x={pos.x}
        y={pos.y}
        radius={7}
        ref={props.ref}
        stroke={color}
        fill={color}
        key={props.id}
        id={`point.${String(props.id)}`}
        onDragMove={e => {
          setPos({ x: e.target.x(), y: e.target.y() })
          props.onMove?.(e.target.x(), e.target.y())
        }}
        onMouseUp={e => {
          setPos({ x: e.target.x(), y: e.target.y() })
          props.onMove?.(e.target.x(), e.target.y())
        }}
      />
    </>
  )
}

export default Keypoint
export type { KeypointProps }
