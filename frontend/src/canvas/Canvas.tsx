import { useRef, useState } from 'react';

//TODO: Move all rectangle box stuff into a separate component and let it be passed in
//This component should just define the div, its style and any tools that can be used on it

const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [end, setEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStart({ x, y });
    setEnd(null);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !start) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setEnd({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (start && end) {
      const topLeft = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
      };
      const bottomRight = {
        x: Math.max(start.x, end.x),
        y: Math.max(start.y, end.y),
      };
      console.log("Top Left:", topLeft);
      console.log("Bottom Right:", bottomRight);
    }
  };

  const getRectStyle = () => {
    if (!start || !end) return { display: "none" };

    const left = Math.min(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    return {
      position: "absolute" as const,
      border: "2px dashed #007bff",
      backgroundColor: "rgba(0, 123, 255, 0.1)",
      left,
      top,
      width,
      height,
      pointerEvents: "none",
    } as React.CSSProperties;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        userSelect: "none",
      }}
    >
      <div style={getRectStyle()} />
    </div>
  );
};

export default Canvas;
