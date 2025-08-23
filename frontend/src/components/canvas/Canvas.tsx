import { ChangeEvent, SyntheticEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { JSX } from 'react/jsx-runtime'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import BoundingBoxTool from './Tools/BoundingBoxTool'
import SelectMoveTool from './Tools/SelectMoveTool'
import mockImage from '../../assets/mock-image.jpg'

interface CanvasTool {
  handleMouseMove: (props: CanvasToolFunctionProps) => void
  handleMouseDown: (props: CanvasToolFunctionProps) => void
  handleMouseUp: (props: CanvasToolFunctionProps ) => void
  toolName: string
}

interface CanvasToolProps {
  stageRef: React.RefObject<Konva.Stage | null>
  addToStage: (el: JSX.Element) => void
}

interface CanvasToolFunctionProps {
  e: Konva.KonvaEventObject<MouseEvent> //i'm being lazy
  dragging:  { (val?: undefined): boolean; (val: boolean): void; }
}


// TODO: add prop with function to change image
const Canvas = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const [stageElements, setStageElements] = useState<JSX.Element[]>([])
  const addToStage = (el: JSX.Element) => {
    setStageElements(p => p.concat(el))
  }
  
  const [isDragging, setDragging] = useState<boolean>(false)
  function dragging(val?:undefined): boolean
  function dragging(val:boolean): void
  function dragging(val?:boolean): boolean | void {return val===undefined ? isDragging : setDragging(val)}

  const tools:CanvasTool[] = [
    BoundingBoxTool({stageRef, addToStage}),
    SelectMoveTool({stageRef, addToStage}),
  ]
  const [activeTool, setActiveTool] = useState<CanvasTool>(tools[0])
  const [toolIndex, setToolIndex] = useState<number>(0)
  useEffect(()=>{
    if (!Number.isNaN(toolIndex) && toolIndex < tools.length && toolIndex >= 0) {
      setActiveTool(tools[toolIndex])
    }
  }, [toolIndex])

 
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
        onMouseDown={e=>activeTool.handleMouseDown({e, dragging})}
        onMouseMove={e=>activeTool.handleMouseMove({e, dragging})}
        onMouseUp={e=>activeTool.handleMouseUp({e, dragging})}
      >
        <Layer>{stageElements}</Layer>
      </Stage>
      <span className='absolute border-black border-[0.1rem] rounded-sm px-[0.4rem] z-10'>
        <input className="w-[1rem] border-black border-[0.1rem] m-[0.1rem] text-center" type="text" onChange={(e)=>setToolIndex(Number(e.target.value))}/>
        <span className='pl-[0.2rem]'>Using: {activeTool.toolName}<br/>Enter a number from 0 to {tools.length-1}</span>
      </span>
    </div>
  )
}

export default Canvas

export type { CanvasTool, CanvasToolProps, CanvasToolFunctionProps }
