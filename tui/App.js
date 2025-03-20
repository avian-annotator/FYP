import { spawn } from "child_process";
import { Box, render, Text, useApp, useInput } from "ink";
import { useCallback, useEffect, useRef, useState } from "react";
import useDimensions from "./useDimensions";

const containers = [
  "frontend_app  |",
  "backend_app   |",
  "postgres-db   |",
  "redis-1       |",
];

const TerminalApp = () => {
  const [output, setOutput] = useState("");
  const [containerLogsReady, setContainerLogsReady] = useState(false);
  const [containerOutputs, setContainerOutputs] = useState(["", "", "", ""]);
  const [selectedContainer, setSelectedContainer] = useState(0);
  const [width, height] = useDimensions();
  const [containerStatus, setContainerStatus] = useState("Starting Docker containers...");
  const dockerProcessRef = useRef(null);
  const { exit } = useApp(); // Get the exit function from Ink
  const [scrollOffset, setScrollOffset] = useState(0);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const maxScrollOffset = useRef(0);
  const maxHorizontalOffset = useRef(0);
  const isShuttingDown = useRef(false);

  // Calculate max scroll offset whenever dimensions or content changes
  const calculateMaxScroll = useCallback(() => {
    if (containerOutputs[selectedContainer]) {
      const lineCount = containerOutputs[selectedContainer].split("\n").length;
      const visibleLines = Math.max(1, height - 8); // Ensure at least 1 visible line
      maxScrollOffset.current = Math.max(0, lineCount - visibleLines);
      
      // Calculate max horizontal offset - find the longest line
      const lines = containerOutputs[selectedContainer].split("\n");
      const maxLineLength = lines.reduce((max, line) => 
        Math.max(max, cleanLine(line).length), 0);
      
      // Set max horizontal scroll based on the longest line and visible width
      maxHorizontalOffset.current = Math.max(0, maxLineLength - (width - 4));
      
      // Adjust current scroll offset if it's now out of bounds
      setScrollOffset(current => Math.min(current, maxScrollOffset.current));
      setHorizontalOffset(current => Math.min(current, maxHorizontalOffset.current));
    }
  }, [containerOutputs, selectedContainer, height, width]);

  // Update maxScrollOffset when dimensions or content changes
  useEffect(() => {
    calculateMaxScroll();
  }, [selectedContainer, containerOutputs, height, width, calculateMaxScroll]);

  useEffect(() => {
    // Only start the process if we haven't already
    if (dockerProcessRef.current === null && !isShuttingDown.current) {
      console.log("Starting Docker containers...");
      
      // Start docker-compose process
      const process = spawn("docker-compose", ["up"], {
        shell: true
      });
      
      // Store the process reference
      dockerProcessRef.current = process;

      process.stdout.on("data", (data) => {
        const newOutput = data.toString();
        setOutput((prevOutput) => prevOutput + newOutput);
        
        // Check if any container is present in the output
        let containerFound = false;
        
        for (let i = 0; i < containers.length; i++) {
          if (newOutput.includes(containers[i])) {
            setContainerLogsReady(true);
            setContainerStatus("Listening to containers...");
            
            // Update the specific container's output
            setContainerOutputs(prevOutputs => {
              const newOutputs = [...prevOutputs];
              newOutputs[i] += newOutput;
              return newOutputs;
            });
            
            containerFound = true;
            // Don't break; we want to check all containers as one log line
            // could contain multiple container identifiers
          }
        }
        
        // If we received output but no container match, it might be relevant to all containers
        if (!containerFound && containerLogsReady) {
          // We could handle this differently if needed
        }
      });

      process.stderr.on("data", (data) => {
        const newOutput = data.toString();
        setContainerStatus("Error...");
        setOutput((prevOutput) => prevOutput + newOutput);
      });

      process.on("error", (error) => {
        setContainerStatus(`Error: ${error.message}`);
      });

      process.on("close", (code) => {
        if (!isShuttingDown.current) {
          setContainerStatus(`Process Exited (code ${code})`);
        }
      });
    }

    // Clean up function
    return () => {
      // Only kill the process if we're cleaning up, but don't run docker-compose down
      if (dockerProcessRef.current && !dockerProcessRef.current.killed) {
        console.log("Component unmounting, killing docker-compose up process");
        dockerProcessRef.current.kill();
      }
    };
  }, []); // Empty dependency array, we only want this to run once

  // Define cleanup function using useCallback to avoid recreating it on each render
  const cleanup = useCallback(() => {
    // Prevent multiple shutdowns
    if (isShuttingDown.current) {
      console.log("Already shutting down, ignoring additional shutdown request");
      return;
    }
    
    isShuttingDown.current = true;
    setContainerStatus("Shutting down Docker containers...");
    console.log("Shutting down Docker containers...");
    
    // Kill the docker-compose up process first
    if (dockerProcessRef.current && !dockerProcessRef.current.killed) {
      dockerProcessRef.current.kill();
    }
    
    // Then run docker-compose down
    const shutdownProcess = spawn("docker-compose", ["down"], { shell: true });
    
    shutdownProcess.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    
    shutdownProcess.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    
    shutdownProcess.on("close", (code) => {
      console.log(`Docker containers shut down with code ${code}`);
      setContainerStatus("Docker containers shut down");
      setTimeout(() => exit(), 500); // Give a slight delay before exiting
    });
  }, [exit]);

  // Register cleanup for SIGINT and SIGTERM in a separate effect
  useEffect(() => {
    // Only register these once
    const handleSigInt = () => {
      console.log("SIGINT received");
      cleanup();
    };
    
    const handleSigTerm = () => {
      console.log("SIGTERM received");
      cleanup();
    };
    
    // Get the global process object
    const globalProcess = global.process;
    
    if (globalProcess) {
      console.log("Registering signal handlers");
      globalProcess.on("SIGINT", handleSigInt);
      globalProcess.on("SIGTERM", handleSigTerm);
      
      // Remove event listeners when component unmounts
      return () => {
        console.log("Removing signal handlers");
        globalProcess.off("SIGINT", handleSigInt);
        globalProcess.off("SIGTERM", handleSigTerm);
      };
    }
  }, [cleanup]); // Add cleanup as a dependency

  // Handle keyboard input with added horizontal scroll support
  useInput((input, key) => {
    // Tab and Shift+Tab for container selection
    if (key.tab) {
      if (key.shift) {
        // Shift+Tab - go left
        setSelectedContainer((selectedContainer + containers.length - 1) % containers.length);
      } else {
        // Tab - go right
        setSelectedContainer((selectedContainer + 1) % containers.length);
      }
    }
    
    // Number keys for direct container selection
    switch (input) {
      case '1':
        setSelectedContainer(0);
        break;
      case '2':
        setSelectedContainer(1);
        break;
      case '3':
        setSelectedContainer(2);
        break;
      case '4':
        setSelectedContainer(3);
        break;
      default:
        // No default action needed
        break;
    }
    
    // Arrow keys combined with shift for horizontal scroll
    if (key.leftArrow) {
     
      // Shift+Left - Horizontal scroll left
      setHorizontalOffset(prev => Math.max(0, prev - 5));
    
    } else if (key.rightArrow) {
     
        // Shift+Right - Horizontal scroll right
      setHorizontalOffset(prev => Math.min(maxHorizontalOffset.current, prev + 5));
    
    }
    
    // Vertical scrolling with up/down arrow keys
    if (key.upArrow) {
      setScrollOffset(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setScrollOffset(prev => Math.min(maxScrollOffset.current, prev + 1));
    }
    
    // Page up/down for faster scrolling
    if (key.pageUp) {
      setScrollOffset(prev => Math.max(0, prev - 10));
    } else if (key.pageDown) {
      setScrollOffset(prev => Math.min(maxScrollOffset.current, prev + 10));
    }
    
    // Home/End keys for navigation
    if (key.home) {
      if (key.shift) {
        // Shift+Home - Go to start of line horizontally
        setHorizontalOffset(0);
      } else {
        // Home without shift - Go to first line
        setScrollOffset(0);
      }
    } else if (key.end) {
      if (key.shift) {
        // Shift+End - Go to end of line horizontally
        setHorizontalOffset(maxHorizontalOffset.current);
      } else {
        // End without shift - Go to last line
        setScrollOffset(maxScrollOffset.current);
      }
    }
  });

  // Helper function to clean up and truncate lines
  const cleanLine = (line) => {
    // Remove trailing whitespace and control characters that cause display issues
    return line.replace(/\s+$/, '').replace(/[\x00-\x1F\x7F]/g, '');
  };

  // Calculate visible lines before rendering
  const visibleLines = containerOutputs[selectedContainer]
    .split("\n")
    .slice(scrollOffset, scrollOffset + Math.max(1, height - 8))
    .map(cleanLine);

  return (
    <Box flexDirection="column" height={height} width={width}>
      {
        !containerLogsReady ? (
          <Text>
            {output || "Starting Docker containers..."}
          </Text>
        ) : (
          <>
            {/* Fixed header area */}
            <Box justifyContent="space-around" flexDirection="row" marginBottom={1}>
              {
                containers.map((container, index) => (
                  <Text key={container} color={index === selectedContainer ? "green" : "white"}>
                    [{index + 1}] {container.split("|")[0].trim()}
                  </Text>
                ))
              }
            </Box>
            
            {/* Scrollable logs area with individual lines */}
            <Box 
              flexDirection="column" 
              height={height - 8} 
              borderStyle="single"
              borderColor="gray"
            >
              {/* Map only visible lines - Use manual horizontal scrolling */}
              {visibleLines.map((cleanedLine, index) => {
                // Calculate visible portion based on horizontal offset
                const visibleText = cleanedLine.length > horizontalOffset
                  ? cleanedLine.substring(horizontalOffset)
                  : '';
                
                return (
                  <Box 
                    key={`line-${index}-${scrollOffset}`} 
                    width={width - 2}
                    height={1}
                  >
                    <Text 
                      color={cleanedLine.includes(containers[selectedContainer]) ? "green" : "white"}
                    >
                      {visibleText}
                    </Text>
                  </Box>
                );
              })}
            </Box>
            
            {/* Scroll indicator with horizontal scroll info */}
            <Box marginTop={1} justifyContent="space-between" flexDirection="row">
              <Text color="gray">
                V-Scroll: {scrollOffset}/{maxScrollOffset.current} (↑/↓)
              </Text>
              <Text color="gray">
                H-Scroll: {horizontalOffset}/{maxHorizontalOffset.current} (←/→)
              </Text>
            </Box>
          </>
        )
      }
      <Box marginTop={1}>
        <Text>Status: {containerStatus}</Text>
        <Text> | Ctrl+C: Exit | ←/→: Scroll horizontally</Text>
      </Box>
    </Box>
  );
};

render(<TerminalApp />);