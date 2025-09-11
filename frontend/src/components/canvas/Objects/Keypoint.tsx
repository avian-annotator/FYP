import Konva from 'konva'
import { Circle } from 'react-konva'
import { RefObject } from 'react'
import { CanvasElementProps } from '../CanvasState'

interface KeypointProps extends CanvasElementProps {
  initialPos: { x: number; y: number }
  ref: RefObject<null | Konva.Circle>
  color?: string
  radius?: number
  onMove?: (x: number, y: number) => void
}

const Keypoint = (props: KeypointProps) => {
  const pos = props.initialPos
  const color = props.color
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
    />
  )
}

export default Keypoint
export type { KeypointProps }
