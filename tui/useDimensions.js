import { useStdout } from "ink";
import { useEffect, useState } from "react";

function useStdoutDimensions() {
    const { stdout } = useStdout();
    const [dimensions, setDimensions] = useState([stdout.columns, stdout.rows]);

    useEffect(() => {
        const handler = () => setDimensions([stdout.columns, stdout.rows]);
        stdout.on("resize", handler);
        return () => {
            stdout.off("resize", handler);
        };
    }, [stdout]);

    return dimensions;
}

export default useStdoutDimensions;
