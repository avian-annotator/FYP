import { useRef } from 'react';
import BBTool from './BBTool';

export interface iCanvasTool {
  handleMouseMove: (e: React.MouseEvent) => void,
  handleMouseDown: (e: React.MouseEvent) => void,
  handleMouseUp: (e: React.MouseEvent) => void,
  objectRep: ()=>React.CSSProperties,
}

const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // add tool switcher
  const activeTool = BBTool({
    containerRef: containerRef,
  });

  return (
    <div
      ref={containerRef}
      onMouseDown={activeTool.handleMouseDown}
      onMouseMove={activeTool.handleMouseMove}
      onMouseUp={activeTool.handleMouseUp}
      //className="relative w-screen h-screen bg-[#f0f0f0] select-none" uncomment when tailwind works
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        userSelect: "none",
      }}
    >
      <div style={activeTool.objectRep()} />
    </div>
  );
};

export default Canvas;
