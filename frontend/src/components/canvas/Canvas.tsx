import { SyntheticEvent, useEffect, useRef, useState, RefObject } from 'react'
import { JSX } from 'react/jsx-runtime'
import Konva from 'konva'
import { Stage, Layer, Transformer } from 'react-konva'
import BoundingBoxTool from './Tools/BoundingBoxTool'
import SelectMoveTool from './Tools/SelectMoveTool'
import mockImage from '../../assets/mock-image.jpg'

interface CanvasTool {
  handleMouseMove: (e: Konva.KonvaEventObject<MouseEvent>, extra: any) => void
  handleMouseDown: (e: Konva.KonvaEventObject<MouseEvent>, extra: any) => void
  handleMouseUp: (e: Konva.KonvaEventObject<MouseEvent>, extra: any) => void
  handleClick: (e: Konva.KonvaEventObject<MouseEvent>, extra: any) => void
  toolName: string
}

interface CanvasToolProps {
  stageRef: React.RefObject<Konva.Stage | null>
  addToStage: (el: JSX.Element) => void
}

interface CanvasObjectProps {
  ref: RefObject<null | Konva.Shape>
  id: number
}

// TODO:  function to change image
const Canvas = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const [stageElements, setStageElements] = useState<JSX.Element[]>([])
  const addToStage = (el: JSX.Element) => {
    setStageElements(p => p.concat(el))
  }

  // transformer for selectmovetool
  const trRef = useRef<Konva.Transformer>(null)
  const [selectedElement, setSelectedElement] = useState<Konva.Shape|null>(null)
  const handleCanvasSelect = (shape: Konva.Shape) => shape ? setSelectedElement(shape) : setSelectedElement(null)
  useEffect(()=>{
    if (selectedElement){
      trRef.current?.nodes([selectedElement])
    } else {
      trRef.current?.nodes([])
      // make undraggable if selected
      stageElements.forEach(el=>{
        if (el.props.ref.current instanceof Konva.Shape) 
          el.props.ref.current.setDraggable(false)
      })
    }
  }, [selectedElement])
  
  // dragging state for boundingboxtool
  const [isDragging, setDragging] = useState<boolean>(false)
  function dragging(val?:undefined): boolean
  function dragging(val:boolean): void
  function dragging(val?:boolean): boolean | void {return val===undefined ? isDragging : setDragging(val)}


  // tool properties... is there a better way then hard coding? 
  const tools:CanvasTool[] = [
    BoundingBoxTool({stageRef, addToStage}),
    SelectMoveTool({stageRef, addToStage}),
  ]
  type toolFuncArg = {[_ in keyof CanvasTool]?: Record<string, any>}
  const toolFuncArgs = [
    {
      handleMouseDown: {dragging},
      handleMouseUp: {dragging},
      handleMouseMove: {dragging}
    },
    {
      handleClick: {handleCanvasSelect}
    }
  ]

  // tool switcher
  const [activeTool, setActiveTool] = useState<CanvasTool>(tools[0])
  const [activeToolFuncExtra, setActiveToolFuncExtra] = useState<toolFuncArg>(toolFuncArgs[0])
  const [toolIndex, setToolIndex] = useState<number>(0)
  useEffect(()=>{
    if (!Number.isNaN(toolIndex) && toolIndex < tools.length && toolIndex >= 0) {
      setActiveTool(tools[toolIndex])
      setActiveToolFuncExtra(toolFuncArgs[toolIndex])
    }
  }, [toolIndex, isDragging])
 
  // image loader
  const currentImage = mockImage // props.image
  const imgRef = useRef<HTMLImageElement>(null)
  const [{w:stageWidth, h:stageHeight}, setStageDim] = useState<{w: number, h: number}>({w:0,h:0})
  const handleImgLoad = (e:SyntheticEvent<HTMLImageElement, Event>) => {
    setStageDim({w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight})
  }

  return (
    <div className="relative w-dvw h-dvh bg-[#f0f0f0] select-none border-gray-700 border-[0.2rem]">
      <img className="absolute" src={currentImage} ref={imgRef} onLoad={handleImgLoad}/>
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        onMouseDown={e=>activeTool.handleMouseDown(e, activeToolFuncExtra.handleMouseDown)}
        onMouseMove={e=>activeTool.handleMouseMove(e, activeToolFuncExtra.handleMouseMove)}
        onMouseUp={e=>activeTool.handleMouseUp(e, activeToolFuncExtra.handleMouseUp)}
        onClick={e=>activeTool.handleClick(e, activeToolFuncExtra.handleClick)}
      >
        <Layer>
          {stageElements}
          <Transformer ref={trRef} rotateEnabled={false}/>
        </Layer>
      </Stage>
      <span className='absolute border-black border-[0.1rem] rounded-sm px-[0.4rem] z-10'>
        <input className="w-[1rem] border-black border-[0.1rem] m-[0.1rem] text-center" type="text" onChange={(e)=>setToolIndex(Number(e.target.value))}/>
        <span className='pl-[0.2rem]'>Using: {activeTool.toolName}<br/>Enter a number from 0 to {tools.length-1}</span>
      </span>
    </div>
  )
}

export default Canvas

export type { CanvasTool, CanvasToolProps, CanvasObjectProps }
