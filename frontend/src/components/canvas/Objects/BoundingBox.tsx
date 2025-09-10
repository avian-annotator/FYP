import Konva from 'konva'
import { Rect, Text } from 'react-konva'
import { RefObject, useState } from 'react'
import { CanvasElementProps } from '../CanvasState'
import { getBackgroundColor } from '../CanvasUtils'

interface BoundingBoxProps extends CanvasElementProps {
  initialPos: { x: number; y: number }
  ref: RefObject<null | Konva.Rect>
  color?: string
}

const BoundingBox = (props: BoundingBoxProps) => {
  const [pos, setPos] = useState<{ x: number; y: number }>(props.initialPos)
  const color = props.color || '#ffffff'
  return (
    <>
      <Rect
        x={pos.x}
        y={pos.y}
        width={0}
        height={0}
        ref={props.ref}
        stroke={color}
        strokeWidth={2}
        fill={getBackgroundColor(props.id)}
        key={props.id}
        id={`rect.${String(props.id)}`}
        onDragMove={e => {
          setPos({ x: e.target.x(), y: e.target.y() })
        }}
        onTransform={e => {
          setPos({ x: e.target.x(), y: e.target.y() })
        }}
        onMouseUp={e => {
          setPos({ x: e.target.x(), y: e.target.y() })
        }}
      />
      {props.label && (
        <Text
          x={pos.x}
          y={pos.y - 25}
          text={props.label}
          fontSize={25}
          fontFamily="Arial"
          fill={color}
          key={`label.${String(props.id)}`}
          id={`label.${String(props.id)}`}
        />
      )}
    </>
  )
}

export default BoundingBox
export type { BoundingBoxProps }
