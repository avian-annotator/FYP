import Konva from 'konva'
import { Rect, Text } from 'react-konva'
import { RefObject, useState } from 'react'
import { CanvasObjectProps } from '../Canvas'
import { getBackgroundColor } from '../CanvasUtils'

interface BoundingBoxLabel {
    text: string
    position: { x: number, y: number }
}

interface BoundingBoxProps extends CanvasObjectProps{
    initialPos: {x: number, y: number}
    ref: RefObject<null | Konva.Rect>
    label?: BoundingBoxLabel
    onLabelUpdate?: (label: BoundingBoxLabel) => void
    color?: string
}

const BoundingBox = (props: BoundingBoxProps) => {
    const [pos, setPos] = useState<{x:number, y:number}>(props.initialPos)
    const [bounds, setBounds] = useState<{left: number, top: number, right: number, bottom: number}>({left: 0, top: 0, right: 0, bottom: 0})
    const color = props.color || "#ffffff"
    
    const updateBounds = (node: Konva.Rect) => {
        const clientRect = node.getClientRect()
        setBounds({
            left: clientRect.x,
            top: clientRect.y,
            right: clientRect.x + clientRect.width,
            bottom: clientRect.y + clientRect.height
        })
    }
    

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
                id={`stage.${String(props.id)}`}
                onDragEnd={e=>{
                    const node = e.target as Konva.Rect
                    setPos({x:e.target.x(),y:e.target.y()})
                    updateBounds(node)
                }}
                onTransformEnd={e=>{
                    const node = e.target as Konva.Rect
                    updateBounds(node)
                }}
                onMouseUp={e=>{
                    const node = e.target as Konva.Rect
                    updateBounds(node)
                }}
            />
            {props.label && (
                <Text
                    x={bounds.left + props.label.position.x}
                    y={bounds.top + props.label.position.y - 5}
                    text={props.label.text}
                    fontSize={20}
                    fontFamily="Arial"
                    fill={color}
                    padding={4}
                    cornerRadius={3}
                    background="white"
                    stroke={color}
                    strokeWidth={1}
                    id={`label.${String(props.id)}`}
                />
            )}
        </>
    )
}

export default BoundingBox
export type { BoundingBoxProps, BoundingBoxLabel }