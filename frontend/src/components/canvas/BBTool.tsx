import React, { useState, Dispatch, SetStateAction } from 'react';
import { iCanvasTool, CanvasObject, Rect, Coord } from './Canvas';

interface iBBToolProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    setCanvasObjects: Dispatch<SetStateAction<CanvasObject[]>>;
}

const BBTool = (props: iBBToolProps): iCanvasTool => {

    const containerRef = props.containerRef;

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
        if (!start || !end) return;
        props.setCanvasObjects(prev=>[...prev, {
            id: prev.length,
            start: start as Coord,
            end: end as Coord,
            colour: null,
        } as Rect])
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

    return {
        handleMouseDown: handleMouseDown,
        handleMouseUp: handleMouseUp,
        handleMouseMove: handleMouseMove,
        objectRep: getRectStyle,
    } as iCanvasTool;
};
export default BBTool;