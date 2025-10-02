import { SyntheticEvent, useEffect, useRef, useState, useReducer } from 'react'
import Konva from 'konva'
import { Stage, Layer, Transformer, Rect, Circle, Line } from 'react-konva'
import BoundingBoxTool from './Tools/BoundingBoxTool'
import SelectMoveTool from './Tools/SelectMoveTool'
import LabelTool from './Tools/LabelTool'
import KeypointsTool from './Tools/KeypointsTool'
import CanvasState, {
  CanvasAction,
  CanvasElement,
  createCanvasState,
  yjsDispatch,
} from './CanvasState'
import { useAnnotate } from '@/annotate/useAnnotate'
import { useAuth } from '@/auth/useAuth'
import * as Y from 'yjs'

interface CanvasTool {
  handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void
  handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void
  handleMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => void
  handleClick: (e: Konva.KonvaEventObject<MouseEvent>) => void
  toolName: string
}

interface CanvasToolProps {
  stageRef: React.RefObject<Konva.Stage | null>
  canvasState: CanvasState
  canvasDispatch: React.ActionDispatch<[action: CanvasAction]>
}

export interface CanvasStateHandle {
  getState: () => CanvasState
}

interface CanvasProps {
  image: string
  tool: number
  workspaceId: string
  imageId: string
}

// TODO:  function to change image
const Canvas = ({ image, tool, workspaceId, imageId }: CanvasProps) => {
  const canvasState = useRef<CanvasState>(createCanvasState()).current
  const stageRef = useRef<Konva.Stage>(null)
  const userId = useAuth().userDetails?.id ?? 0

  const { publishAnnotationActions } = useAnnotate({
    workspaceId,
    imageId,
    onReceiveAnnotation: message => {
      const action = JSON.parse(message.action) as CanvasAction
      // console.log('action')
      if (
        message.userId !== userId &&
        message.actionType !== 'join' &&
        message.actionType !== 'leave'
      ) {
        yjsDispatch(canvasState, action)
      }
    },
  })

  const canvasDispatch = (action: CanvasAction) => {
    yjsDispatch(canvasState, action)
    publishAnnotationActions({
      userId,
      action: JSON.stringify(action),
      actionType: action.type,
    })
  }

  // transformer for selectmovetool
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    const onChange = () => {
      setStageDim(prev => ({ ...prev }))
    } // force re-render
    canvasState.canvasElements.observeDeep(onChange)
    canvasState.userState.observeDeep(onChange)
    return () => {
      canvasState.canvasElements.unobserveDeep(onChange)
      canvasState.userState.unobserveDeep(onChange)
    }
  }, [canvasState])
  // tool switcheruserId
  const tools: CanvasTool[] = [
    BoundingBoxTool({ stageRef, canvasState, canvasDispatch }),
    SelectMoveTool({ stageRef, canvasState, canvasDispatch }),
    LabelTool({ stageRef, canvasState, canvasDispatch }),
    KeypointsTool({ stageRef, canvasState, canvasDispatch }),
  ]
  const activeTool = tools[tool] ?? tools[0]

  // image loader
  const imgRef = useRef<HTMLImageElement>(null)
  const [{ w: stageWidth, h: stageHeight }, setStageDim] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  })
  const handleImgLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget

    const scale = 450 / naturalWidth
    const scaledHeight = naturalHeight * scale

    setStageDim({ w: 450, h: scaledHeight })
  }
  const elementRefs = useRef<Record<number, Konva.Node | null>>({})
  useEffect(() => {
    const selectionId = Number(
      canvasState.userState.toArray().find((user: { userId: number }) => user.userId === userId)
        ?.currentSelectionId,
    )

    const selectedNode = selectionId ? elementRefs.current[selectionId] : null

    if (selectedNode) {
      trRef.current?.nodes([selectedNode])
      trRef.current?.resizeEnabled(
        selectedNode.getClassName() !== 'Circle' && selectedNode.getClassName() !== 'Line',
      )
    } else {
      trRef.current?.nodes([])
    }
    trRef.current?.getLayer()?.batchDraw()
  }, [[userId, canvasState.userState]])

  const renderShape = (el: CanvasElement) => {
    // select and move logic moved inside the render because it wasn't working in the tool. i know this is very annoying
    const props = {
      ...el.props,
      id: el.id.toString(),
      onDragMove: (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (el.type === 'rectangle') {
          canvasDispatch({
            type: 'updateElement',
            id: el.id,
            props: {
              ...el.props,
              x: e.target.x(),
              y: e.target.y(),
            },
          })
        }
        if (el.type === 'circle') {
          const newX = e.target.x()
          const newY = e.target.y()
          canvasDispatch({
            type: 'updateElement',
            id: el.id,
            props: { ...el.props, x: newX, y: newY },
          })

          // Update all connected lines immediately
          const connectedLines = canvasState.canvasElements
            .toArray()
            .filter(
              elem => elem.type === 'line' && (elem.startId === el.id || elem.endId === el.id),
            )

          connectedLines.forEach(line => {
            const start = canvasState.canvasElements.toArray().find(p => p.id === line.startId)
            const end = canvasState.canvasElements.toArray().find(p => p.id === line.endId)

            if (start && end) {
              canvasDispatch({
                type: 'updateElement',
                id: line.id,
                props: {
                  ...line.props,
                  points: [start.props.x, start.props.y, end.props.x, end.props.y],
                },
              })
            }
          })
        }
      },
      onTransform: (e: Konva.KonvaEventObject<MouseEvent>) => {
        canvasDispatch({
          type: 'updateElement',
          id: el.id,
          props: {
            ...el.props,
            x: e.target.x(),
            y: e.target.y(),
            width: e.target.width() * e.target.scaleX(),
            height: e.target.height() * e.target.scaleY(),
          },
        })
        e.target.scaleX(1)
        e.target.scaleY(1)
      },
      ref: (node: Konva.Rect | Konva.Circle | Konva.Line | null) => {
        if (node) {
          elementRefs.current[el.id] = node
        }
      },
    }
    switch (el.type) {
      case 'rectangle':
        return <Rect key={el.id} {...props} />
      case 'circle':
        return <Circle key={el.id} {...props} />
      case 'line':
        return <Line key={el.id} {...props} />
      default:
        return null
    }
  }

  return (
    <div className=" bg-[#f0f0f0] select-none border-gray-700 border-[0.2rem] flex items-center justify-center">
      <div className="relative">
        <img
          className="absolute"
          src={image}
          width={stageWidth}
          ref={imgRef}
          onLoad={handleImgLoad}
        />

        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          onMouseDown={activeTool.handleMouseDown}
          onMouseMove={activeTool.handleMouseMove}
          onMouseUp={activeTool.handleMouseUp}
          onClick={e => {
            if (activeTool.toolName === 'SelectandMoveTool') {
              if (e.target instanceof Konva.Shape) {
                const id = Number(e.target.id())
                canvasDispatch({ type: 'setDragging', userId, isDragging: true })
                canvasDispatch({ type: 'setSelected', id, userId })
                e.target.draggable(true)
              } else {
                canvasDispatch({ type: 'setDragging', userId, isDragging: false })
                canvasDispatch({ type: 'clearSelected', userId })
              }
            }
            if (activeTool.toolName === 'LabelTool') {
              if (e.target instanceof Konva.Shape) {
                const labelText = prompt('Enter label text:')
                if (labelText && labelText.trim()) {
                  const shapeId = Number(e.target.id().split('.')[1])
                  const label = labelText.trim()
                  canvasDispatch({ type: 'addLabel', id: shapeId, label: label })
                }
              }
            }
          }}
        >
          <Layer>
            {canvasState.canvasElements.map(el => renderShape(el))}
            <Transformer ref={trRef} rotateEnabled={false} />
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Canvas

export type { CanvasTool, CanvasToolProps }
