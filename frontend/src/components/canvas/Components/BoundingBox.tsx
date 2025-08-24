import Konva from 'konva'
import { Rect } from 'react-konva'
import { RefObject, useState } from 'react'

interface BoundingBoxProps {
    initialPos: {x: number, y: number}
    ref: RefObject<null | Konva.Rect>
    id: number
}

const BoundingBox = (props: BoundingBoxProps) => {
    const [pos, setPos] = useState<{x:number, y:number}>(props.initialPos)
    return (
        <Rect
            x={pos.x}
            y={pos.y}
            width={0}
            height={0}
            ref={props.ref}
            stroke="#007bff"
            strokeWidth={2}
            fill="rgba(0, 123, 255, 0.1)"
            key={props.id}
            id={`stage.${String(props.id)}`}
            draggable
            onDragEnd={e=>setPos({x:e.target.x(),y:e.target.y()})}
        />
    )
}


export default BoundingBox
export type { BoundingBoxProps }
