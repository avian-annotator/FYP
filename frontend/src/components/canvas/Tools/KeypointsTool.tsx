import { useRef, useState } from 'react'
import { CanvasTool, CanvasToolProps } from '../Canvas'
import Konva from 'konva'
import Keypoint from '../Objects/Keypoint'
import ConnectingLine from '../Objects/ConnectingLine'
import { getColor } from '../CanvasUtils'

interface Edge {
  startId: number
  endId: number
}

const KeypointsTool = (props: CanvasToolProps): CanvasTool => {
  const stageRef = props.stageRef
  const tempLineRef = useRef<Konva.Line>(null)

  const lineRef = useRef<Konva.Line>(null)
  const pointRef = useRef<Konva.Circle>(null)

  const [points, setPoints] = useState<{ id: number; x: number; y: number }[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [draggingEdge, setDraggingEdge] = useState<{
    startId: number
    x: number
    y: number
  } | null>(null)

  //helper to get point at position
  const getPointAtPos = (x: number, y: number) => {
    return points.find(p => Math.hypot(p.x - x, p.y - y) < 10)
  }

  const handleMouseDown = (_: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    const clickedPoint = getPointAtPos(pos.x, pos.y)
    //if clicked on a point, start dragging an edge
    if (clickedPoint) {
      setDraggingEdge({ startId: clickedPoint.id, x: clickedPoint.x, y: clickedPoint.y })
      //temp line to visualise
      const tempLine = (
        <ConnectingLine
          key="temp-line"
          id={998} //hard coded id for temp line
          ref={tempLineRef}
          points={[
            { x: clickedPoint.x, y: clickedPoint.y },
            { x: pos.x, y: pos.y },
          ]}
          color="blue"
        />
      )
      props.canvasDispatch({ type: 'addElement', element: tempLine })
    } else {
      //if not clicked on a line, add a new point
      const id = points.length
      const newPoint = { id, x: pos.x, y: pos.y }
      const keypoint = (
        <Keypoint
          id={id}
          ref={pointRef}
          initialPos={{ x: pos.x, y: pos.y }}
          color={getColor(id)}
          onMove={(x, y) => {
            setPoints(prev => prev.map(p => (p.id === id ? { ...p, x, y } : p)))
          }}
        />
      )
      props.canvasDispatch({ type: 'addElement', element: keypoint })
      setPoints(prev => [...prev, newPoint])
    }
  }

  const handleMouseMove = (_: Konva.KonvaEventObject<MouseEvent>) => {
    if (!draggingEdge) return
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    setDraggingEdge(prev => (prev ? { ...prev, x: pos.x, y: pos.y } : null))

    // Temporary line follows mouse
    const startPoint = points.find(p => p.id === draggingEdge.startId)
    if (!startPoint || !tempLineRef.current) return

    tempLineRef.current.points([startPoint.x, startPoint.y, pos.x, pos.y])
  }

  const handleMouseUp = (_: Konva.KonvaEventObject<MouseEvent>) => {
    if (!draggingEdge) return
    const pos = stageRef.current?.getPointerPosition()
    if (!pos) return

    const targetPoint = getPointAtPos(pos.x, pos.y)

    if (targetPoint && targetPoint.id !== draggingEdge.startId) {
      setEdges(prev => [...prev, { startId: draggingEdge.startId, endId: targetPoint.id }])

      const startPoint = points.find(p => p.id === draggingEdge.startId)
      if (startPoint) {
        const line = (
          <ConnectingLine
            id={999 + edges.length} //better way to get unique id probably
            ref={lineRef}
            points={[
              { x: startPoint.x, y: startPoint.y },
              { x: pos.x, y: pos.y },
            ]}
            color="red"
          />
        )
        props.canvasDispatch({ type: 'addElement', element: line })
      }
    }

    if (tempLineRef.current) {
      tempLineRef.current.destroy()
    }
    setDraggingEdge(null)
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
