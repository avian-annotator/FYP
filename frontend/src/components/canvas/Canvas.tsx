import { SyntheticEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  
  const [isDragging, setDragging] = useState<boolean>(false)
  function dragging(val?:undefined): boolean
  function dragging(val:boolean): void
  function dragging(val?:boolean): boolean | void {return val===undefined ? isDragging : setDragging(val)}

  const [isBoundingBoxToolActive, setIsBoundingBoxToolActive] = useState<boolean>(true)
  const toggleBoundingBoxToolActive = () =>setIsBoundingBoxToolActive(prev=>!prev)

  const addToStage = (el: JSX.Element) => {
    setStageElements(p => p.concat(el))
  }

  const bbTool = BoundingBoxTool({stageRef, addToStage})
  const smTool = SelectMoveTool({stageRef, addToStage})
  const [activeTool, setActiveTool] = useState<CanvasTool>(bbTool)

  useEffect(()=>{
    if (isBoundingBoxToolActive) {
      setActiveTool(bbTool)
    } else {
      setActiveTool(smTool)
    }
  }, [isBoundingBoxToolActive])
 
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
        <input type="checkbox" defaultChecked={isBoundingBoxToolActive} onChange={toggleBoundingBoxToolActive}/>
        <span className='pl-[0.2rem]'>Using: {activeTool.toolName}</span>
      </span>
    </div>
  )
}

export default Canvas

export type { CanvasTool, CanvasToolProps, CanvasToolFunctionProps }
