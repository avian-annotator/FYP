import { SyntheticEvent, useEffect, useRef, useState, useReducer, useImperativeHandle } from 'react'
import Konva from 'konva'
import { Stage, Layer, Transformer, Rect, Circle, Line } from 'react-konva'
import BoundingBoxTool from './Tools/BoundingBoxTool'
import SelectMoveTool from './Tools/SelectMoveTool'
import LabelTool from './Tools/LabelTool'
import KeypointsTool from './Tools/KeypointsTool'
import CanvasState, {
  canvasReducer,
  initalCanvasState,
  CanvasAction,
  CanvasElement,
} from './CanvasState'
import { useAnnotate } from '@/annotate/useAnnotate'
import { useAuth } from '@/auth/useAuth'
import * as Y from 'yjs'

export const ydoc = new Y.Doc()
export const yCanvasElements = ydoc.getArray<CanvasElement>('canvasElements')

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
  const stageRef = useRef<Konva.Stage>(null)
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
        localDispatch(action)
      }
    },
  })

  const userId = useAuth().userDetails?.id ?? 0

  // Create a custom dispatch function that will publish actions to other users
  const [canvasState, localDispatch] = useReducer(
    (state: CanvasState, action: CanvasAction) => canvasReducer(state, action),
    initalCanvasState,
  )

  const canvasDispatch = (action: CanvasAction) => {
    // First dispatch locally
    //
    // TODO: remove this
    if (action.type === 'addElement') return
    localDispatch(action)
    // Then publish to other users
    publishAnnotationActions({
      userId,
      action: JSON.stringify(action),
      actionType: action.type,
    })
  }

  // transformer for selectmovetool
  const trRef = useRef<Konva.Transformer>(null)

  // tool switcheruserId
  const tools: CanvasTool[] = [
    BoundingBoxTool({ stageRef, canvasState, canvasDispatch }),
    SelectMoveTool({ stageRef, canvasState, canvasDispatch}),
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
    const selectionId = Number(canvasState.userState.find(
      user => user.userId === userId,
    )?.currentSelectionId)

    const selectedNode = selectionId ? elementRefs.current[selectionId] : null


    if (selectedNode) {
      trRef.current?.nodes([selectedNode])
      trRef.current?.resizeEnabled(
        selectedNode.getClassName() !== 'Circle' && selectedNode.getClassName() !== 'Line',
      )
       trRef.current?.getLayer()?.batchDraw();
    } else {
      trRef.current?.nodes([])
       trRef.current?.getLayer()?.batchDraw();
    }
  }, [canvasState.userState, elementRefs.current])


  const renderShape = (el: CanvasElement) => {
    const props = {
      ...el.props,
      key: el.id,
      id: el.id.toString(),
      onDragEnd: (e: Konva.KonvaEventObject<MouseEvent>) => {
        canvasDispatch({
          type: 'updateElement',
          id: el.id,
          props: { ...el.props, x: e.target.x(), y: e.target.y() },
        })
      },
      onTransformEnd: (e: Konva.KonvaEventObject<MouseEvent>) => {
        const node = e.target
        canvasDispatch({
          type: 'updateElement',
          id: el.id,
          props: {
            ...el.props,
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
          },
        })
        node.scaleX(1)
        node.scaleY(1)
      },
      ref: (node: Konva.Rect | Konva.Circle | Konva.Line | null) => {
        elementRefs.current[el.id] = node
      },
    }
    switch (el.type) {
      case 'rectangle':
        return <Rect {...props} />
      case 'circle':
        return <Circle {...props} />
      case 'line':
        return <Line {...props} />
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
          onClick={e =>  {if (e.target instanceof Konva.Shape) {
      const id = Number(e.target.id());
       canvasDispatch({type: 'setDragging', userId, isDragging:true})
        canvasDispatch({ type: 'setSelected', id, userId });
        e.target.draggable(true)
           } else {
    canvasDispatch({type: 'setDragging', userId, isDragging:false})
      canvasDispatch({ type: 'clearSelected', userId });
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
