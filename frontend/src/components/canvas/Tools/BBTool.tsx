import React, { useState } from 'react'
import { CanvasTool, CanvasToolProps } from '../Canvas'
import { CanvasToolMarker, isCanvasToolMarker } from '../CanvasUtils'
import BoundingBox from '../Objects/BoundingBox'

const MARKER_ID = 1

const BBTool = (props: CanvasToolProps): CanvasTool => {
  const containerRef = props.containerRef

  const [start, setStart] = useState<{ x: number; y: number } | null>(null)
  const [end, setEnd] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    if (e.button !== 0) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setStart({ x, y })
    setEnd({ x, y })
    setIsDragging(true)

    const marker = {
      markerId: MARKER_ID,
    } as CanvasToolMarker

    props.setCanvasObjects(prev => [...prev, marker])
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !start) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setEnd({ x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (!start || !end) return
    // convert marker to BoundingBox
    props.setCanvasObjects(prev => {
      const i = prev.findIndex(v => isCanvasToolMarker(v) && v.markerId === MARKER_ID)
      prev[i] = new BoundingBox(i, start, end, null)
      return prev
    })
  }

  const getMarkerBB = () => {
    if (!start || !end) return { display: 'none' }

    const left = Math.min(start.x, end.x)
    const top = Math.min(start.y, end.y)
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)

    return (
      <div
        key="BBMarker"
        style={{
          position: 'absolute' as const,
          border: '2px dashed #007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          left,
          top,
          width,
          height,
          pointerEvents: 'none',
        }}
      />
    )
  }

  return {
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
    handleMouseMove: handleMouseMove,
    markerElement: getMarkerBB,
    markerId: MARKER_ID,
  } as CanvasTool
}
export default BBTool
