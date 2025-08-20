'use client'
import { motion } from 'framer-motion'
import React from 'react'


export default function ScatterText({text}: {text: string}) {
  const [isScattered, setIsScattered] = React.useState(false)
  const randomOffsets = React.useRef(
    text.split('').map(() => ({
      x: Math.random() * 300 - 150, 
      y: Math.random() * 300 - 150
    }))
  )
  return (
    <motion.div
      style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', cursor: 'pointer' }}
      onMouseEnter={() => setIsScattered(true)}
      onMouseLeave={() => setIsScattered(false)}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={isScattered ? { x: randomOffsets.current[i].x, y: randomOffsets.current[i].y, opacity: 1 } : { x: 0, y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}
