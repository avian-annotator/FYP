import { createRef, useEffect, useRef, useState } from 'react'
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

  const linesRef = useRef<Record<number, React.RefObject<Konva.Line | null> | undefined>>({})
  const pointsRef = useRef<Record<number, React.RefObject<Konva.Circle | null> | undefined>>({})

  const [points, setPoints] = useState<{ id: number; x: number; y: number }[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [draggingEdge, setDraggingEdge] = useState<{
    startId: number
    x: number
    y: number
  } | null>(null)

  //helper to render lines
  useEffect(() => {
    const edgeElements = edges.map((edge, i) => {
      const startPoint = points.find(p => p.id === edge.startId)
      const endPoint = points.find(p => p.id === edge.endId)

      if (!startPoint || !endPoint) return null
      const id = 1000 + i

      // eslint-disable-next-line react-x/no-create-ref
      linesRef.current[id] ??= createRef<Konva.Line>()
      props.canvasDispatch({ type: 'removeElement', id: id })
      return (
        <ConnectingLine
          ref={linesRef.current[id]}
          key={id}
          id={1000 + i}
          points={[
            { x: startPoint.x, y: startPoint.y },
            { x: endPoint.x, y: endPoint.y },
          ]}
          color="red"
        />
      )
    })
    edgeElements
      .filter(edge => edge != null)
      .forEach(edge => {
        props.canvasDispatch({ type: 'addElement', element: edge })
      })
  }, [edges, points])

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
          key={'temp-line'}
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
      const id = points.length + 20
      const newPoint = { id, x: pos.x, y: pos.y }
      // eslint-disable-next-line react-x/no-create-ref
      const pointRef = createRef<Konva.Circle>()
      pointsRef.current[id] = pointRef
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
    }

    if (tempLineRef.current) {
      tempLineRef.current.destroy()
      props.canvasDispatch({ type: 'removeElement', id: 998 })
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
