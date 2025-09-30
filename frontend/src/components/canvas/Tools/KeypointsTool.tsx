import { createRef, useEffect, useRef, useState } from 'react'
import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'
import Keypoint from '../Objects/Keypoint'
import ConnectingLine from '../Objects/ConnectingLine'
import { getBackgroundColor, getColor } from '../CanvasUtils'
import { CanvasElement } from '../CanvasState'
interface Edge {
  startId: number
  endId: number
}

const userId = 0

const KeypointsTool = (props: CanvasToolProps): CanvasTool => {
  const stageRef = props.stageRef

  const [points, setPoints] = useState<{ id: number; x: number; y: number }[]>([])
  const [draggingEdge, setDraggingEdge] = useState<{
    startId: number
    x: number
    y: number
  } | null>(null)

  //helper to get point at position

  const getPointAtPos = (x: number, y: number) => {
    console.log(
      x,
      y,
      'point',
      points.find(p => Math.hypot(p.x - x, p.y - y) < 10),
    )
    return points.find(p => Math.hypot(p.x - x, p.y - y) < 10)
  }

  const handleMouseDown = (_: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    const clickedPoint = getPointAtPos(pos.x, pos.y)
    //if clicked on a point, start dragging an edge
    if (clickedPoint) {
      setDraggingEdge({ startId: clickedPoint.id, x: clickedPoint.x, y: clickedPoint.y })
      props.canvasDispatch({ type: 'removeElement', id: 998 })
      //temp line to visualise
      const tempLine: CanvasElement = {
        id: 998, // hard coded id for temp line
        type: 'line',
        props: {
          points: [clickedPoint.x, clickedPoint.y, pos.x, pos.y],

          color: 'blue',
        },
      }
      console.log(JSON.stringify(tempLine))
      props.canvasDispatch({ type: 'addElement', element: tempLine })
    } else {
      //if not clicked on a line, add a new point
      const id = points.length + 20
      const newPoint = { id, x: pos.x, y: pos.y }

      const keypoint: CanvasElement = {
        id,
        type: 'circle',
        props: {
          x: pos.x,
          y: pos.y,
          radius:5,
          fill: 'red',
        },
      }
      props.canvasDispatch({ type: 'addElement', element: keypoint })
      setPoints(prev => [...prev, newPoint])
    }
  }

  const handleMouseMove = (_: Konva.KonvaEventObject<MouseEvent>) => {
    if (!draggingEdge) return
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return
    const user = props.canvasState.userState.find(u => u.userId === userId)
    const templine = props.canvasState.canvasElements.find(e => e.id === 998)

    setDraggingEdge(prev => (prev ? { ...prev, x: pos.x, y: pos.y } : null))

    // Temporary line follows mouse
    const startPoint = props.canvasState.canvasElements.find(el => el.type === 'circle' && el.id === draggingEdge.startId)
    if (!startPoint) return

    if (templine) {
      props.canvasDispatch({
        type: 'updateElement',
        id: 998,
        props: {
          points: [startPoint.props.x, startPoint.props.y, pos.x, pos.y],
          stroke: 'blue',
          strokeWidth: 2,
        },
      })
    }
  }

  const handleMouseUp = (_: Konva.KonvaEventObject<MouseEvent>) => {
    console.log(JSON.stringify(props.canvasState.canvasElements))
    if (!draggingEdge) return
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    props.canvasDispatch({ type: 'removeElement', id: 998 })
    const targetPoint = getPointAtPos(pos.x, pos.y)

  
    if (targetPoint) {
    const startPoint = props.canvasState.canvasElements.find(el => el.type === 'circle' && el.id === draggingEdge.startId)
    const endPoint = props.canvasState.canvasElements.find(el => el.type === 'circle' && el.id === targetPoint.id)
    if(startPoint && endPoint){
    const line: CanvasElement = {
          id:stageRef.current?.children[0].children.length ?? 0,
          type: 'line',
          props: {
            points: [startPoint.props.x, startPoint.props.y, endPoint.props.x, endPoint.props.y],
            stroke: 'red',
            strokeWidth: 2,
          },
        }
      props.canvasDispatch({ type: 'addElement', element: line })
      setDraggingEdge(null)
      props.canvasDispatch({ type: 'removeElement', id: 998 })}
    }
  }

  const handleClick = (_: Konva.KonvaEventObject<MouseEvent>) => {}

  const handleDragging = () => {
    
  }

  const toolName = 'Keypoint Tool'

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
    toolName,
  } as CanvasTool
}

export default KeypointsTool
