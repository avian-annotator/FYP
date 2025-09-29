import { SyntheticEvent, useEffect, useRef, useState, useReducer, useImperativeHandle } from 'react'
import Konva from 'konva'
import { Stage, Layer, Transformer } from 'react-konva'
import BoundingBoxTool from './Tools/BoundingBoxTool'
import SelectMoveTool from './Tools/SelectMoveTool'
import LabelTool from './Tools/LabelTool'
import KeypointsTool from './Tools/KeypointsTool'
import CanvasState, { canvasReducer, initalCanvasState, CanvasAction } from './CanvasState'
import { useAnnotate } from '@/annotate/useAnnotate'
import { useAuth } from '@/auth/useAuth'

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


  useEffect(() => {
    const selectionId = canvasState.userState.find(
      user => user.userId === userId,
    )?.currentSelectionId
    const currentSelection = canvasState.canvasElements.find(el => el.props.id === selectionId)
    const canvasShape = currentSelection?.props.ref.current
    if (canvasShape !== undefined && canvasShape instanceof Konva.Shape) {
      if (canvasShape instanceof Konva.Circle) {
        //so keypoints are not resized
        trRef.current?.resizeEnabled(false)
        trRef.current?.nodes([canvasShape])
      } else if (canvasShape instanceof Konva.Line) {
        trRef.current?.resizeEnabled(false)
      } else {
        trRef.current?.nodes([canvasShape])
        trRef.current?.resizeEnabled(true)
      }
    } else {
      trRef.current?.nodes([])
      // make undraggable if selected
      canvasState.canvasElements.forEach(el => el.props.ref.current?.setDraggable(false))
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
          onClick={activeTool.handleClick}
        >
          <Layer>
            {canvasState.canvasElements}
            <Transformer ref={trRef} rotateEnabled={false} />
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Canvas

export type { CanvasTool, CanvasToolProps }
