"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, transform, MotionValue } from "framer-motion";

const boxSize = 80; // Fixed box size for better visual consistency

export default function MagneticFilling() {
  const x = useMotionValue(-boxSize);
  const y = useMotionValue(-boxSize);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      x.set(event.clientX - boxSize / 2);
      y.set(event.clientY - boxSize / 2);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [x, y]);

  // Calculate grid dimensions based on screen size
  const columns = Math.ceil(dimensions.width / boxSize) + 2; // +2 for buffer
  const rows = Math.ceil(dimensions.height / boxSize) + 2; // +2 for buffer

  const boxes = [];
  for (let row = -1; row < rows; row++) {
    for (let column = -1; column < columns; column++) {
      boxes.push({ row, column });
    }
  }

  return (
    <div style={styles.page}>
      <div 
        style={{
          ...styles.container,
          width: dimensions.width,
          height: dimensions.height,
        }} 
        ref={containerRef}
      >
        {boxes.map(({ row, column }) => (
          <Box
            x={x}
            y={y}
            row={row}
            column={column}
            key={`${row}-${column}`}
            screenWidth={dimensions.width}
            screenHeight={dimensions.height}
          />
        ))}
      </div>
    </div>
  );
}

const Box = ({
  x,
  y,
  row,
  column,
  screenWidth,
  screenHeight,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  row: number;
  column: number;
  screenWidth: number;
  screenHeight: number;
}) => {
  const top = row * boxSize;
  const left = column * boxSize;
  const angle = useMotionValue(0);
  const scale = useMotionValue(0);
  const borderRadius = useMotionValue(0);
  const borderColor = useMotionValue("#4c41386b");

  React.useEffect(() => {
    function updateProps() {
      const updatedAngle = calcAngle(top, left, x.get(), y.get());
      angle.set(updatedAngle);
      
      const proximity = Math.sqrt(
        Math.pow(left - x.get(), 2) + Math.pow(top - y.get(), 2)
      );
      
      const maxDistance = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
      
      const newScale = transform(proximity, [0, maxDistance * 0.3], [0.8, 0.3]);
      const newBorderRadius = transform(
        proximity,
        [0, maxDistance * 0.3],
        [boxSize * 0.15, boxSize * 0.4]
      );
      
      // More dynamic color based on proximity
      const colorIntensity = transform(proximity, [0, 300], [0.8, 0.2]);
      borderColor.set(`rgba(76, 65, 56, ${colorIntensity})`);
      
      scale.set(Math.max(newScale, 0.2)); // Minimum scale
      borderRadius.set(newBorderRadius);
    }
    
    const unsubscribeX = x.onChange(updateProps);
    const unsubscribeY = y.onChange(updateProps);
    
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [screenWidth, screenHeight]);

  return (
    <motion.div
      style={{
        ...styles.Box,
        position: "absolute",
        top,
        left,
        background: "transparent",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor,
        scale,
        borderRadius,
        rotate: angle,
      }}
    />
  );
};

function calcAngle(top: number, left: number, cursorTop: number, cursorLeft: number) {
  const angle = Math.atan2(cursorTop - left, cursorLeft - top) * (180 / Math.PI);
  return angle < 0 ? -(angle + 540) : -(angle + 180);
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -1, // Behind other content
    overflow: "hidden",
    pointerEvents: "none", // Allows clicking through to content below
  },
  container: {
    position: "relative",
    pointerEvents: "none", // Completely disable pointer events for the container
  },
  Box: {
    height: boxSize,
    width: boxSize,
    pointerEvents: "none", // Ensure boxes don't interfere with mouse events
  },
  magnet: {
    height: boxSize,
    width: boxSize,
    borderRadius: boxSize * 0.33,
    pointerEvents: "none",
  },
};
