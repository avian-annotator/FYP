import { useState } from 'react'
import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'
import { CanvasElement } from '../CanvasState'
import { useAuth } from '@/auth'

const KeypointsTool = (props: CanvasToolProps): CanvasTool => {
  const userId = useAuth().userDetails?.id ?? 0
  const stageRef = props.stageRef

  const [draggingEdge, setDraggingEdge] = useState<{
    startId: string
    x: number
    y: number
  } | null>(null)

  const points = props.canvasState.canvasElements.toArray().filter(e => e.type === 'circle')

  //helper to get point at position
  const getPointAtPos = (x: number, y: number) => {
    return points.find(p => Math.hypot(p.props.x - x, p.props.y - y) < 10)
  }

  const handleMouseDown = (_: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    const clickedPoint = getPointAtPos(pos.x, pos.y)
    //if clicked on a point, start dragging an edge
    if (clickedPoint) {
      setDraggingEdge({
        startId: clickedPoint.id,
        x: Number(clickedPoint.props.x),
        y: Number(clickedPoint.props.y),
      })
      props.canvasDispatch({ type: 'removeElement', id: '998' })
      //temp line to visualise
      const tempLine: CanvasElement = {
        id: '998', // hard coded id for temp line
        type: 'line',
        props: {
          points: [clickedPoint.props.x, clickedPoint.props.y, pos.x, pos.y],

          color: 'blue',
        },
      }
      props.canvasDispatch({ type: 'addElement', element: tempLine })
    } else {
      //if not clicked on a line, add a new point
      const elementId = points.length + 20
      const id = `${String(userId)}_${String(elementId)}`
      const keypoint: CanvasElement = {
        id,
        type: 'circle',
        props: {
          x: pos.x,
          y: pos.y,
          radius: 5,
          fill: 'red',
        },
      }
      props.canvasDispatch({ type: 'addElement', element: keypoint })
    }
  }

  const handleMouseMove = (_: Konva.KonvaEventObject<MouseEvent>) => {
    if (!draggingEdge) return
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return
    const templine = props.canvasState.canvasElements.toArray().find(e => e.id === '998')

    setDraggingEdge(prev => (prev ? { ...prev, x: pos.x, y: pos.y } : null))

    // Temporary line follows mouse
    const startPoint = props.canvasState.canvasElements
      .toArray()
      .find(el => el.type === 'circle' && el.id === draggingEdge.startId)
    if (!startPoint) return

    if (templine) {
      props.canvasDispatch({
        type: 'updateElement',
        id: '998',
        props: {
          points: [startPoint.props.x, startPoint.props.y, pos.x, pos.y],
          stroke: 'blue',
          strokeWidth: 2,
        },
      })
    }
  }

  const handleMouseUp = (_: Konva.KonvaEventObject<MouseEvent>) => {
    if (!draggingEdge) return
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    props.canvasDispatch({ type: 'removeElement', id: '998' })
    const targetPoint = getPointAtPos(pos.x, pos.y)

    if (targetPoint) {
      const elementId = props.canvasState.canvasElements.length + 1
      const id = `${String(userId)}_${String(elementId)}`
      const startPoint = props.canvasState.canvasElements
        .toArray()
        .find(el => el.type === 'circle' && el.id === draggingEdge.startId)
      const endPoint = props.canvasState.canvasElements
        .toArray()
        .find(el => el.type === 'circle' && el.id === targetPoint.id)
      if (startPoint && endPoint) {
        const line: CanvasElement = {
          id: id,
          type: 'line',
          props: {
            points: [startPoint.props.x, startPoint.props.y, endPoint.props.x, endPoint.props.y],
            stroke: 'red',
            strokeWidth: 2,
          },
          startId: startPoint.id,
          endId: endPoint.id,
        }
        props.canvasDispatch({ type: 'addElement', element: line })
        setDraggingEdge(null)
        props.canvasDispatch({ type: 'removeElement', id: '998' })
      }
    }
  }

  const handleClick = (_: Konva.KonvaEventObject<MouseEvent>) => {}

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
