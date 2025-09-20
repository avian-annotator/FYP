import Konva from 'konva'
import { Line } from 'react-konva'
import { RefObject } from 'react'
import { CanvasElementProps } from '../CanvasState'

interface ConnectingLineProps extends CanvasElementProps {
  points: { x: number; y: number }[]
  startId: number
  endId: number
  ref: RefObject<null | Konva.Line>
  color?: string
}

const ConnectingLine = (props: ConnectingLineProps) => {
  const flatPoints = props.points.flatMap(p => [p.x, p.y])
  const color = props.color || 'red'

  return (
    <Line
      ref={props.ref}
      points={flatPoints}
      stroke={color}
      strokeWidth={2}
      lineCap="round"
      lineJoin="round"
      key={props.id}
      id={`skeleton.${String(props.id)}`}
    />
  )
}

export default ConnectingLine
export type { ConnectingLineProps }
