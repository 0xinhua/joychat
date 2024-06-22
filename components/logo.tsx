"use client"

import { cn } from '@/lib/utils'
import React, { useState, useEffect, useRef } from 'react'

interface AnimatedChatBotLogoProps {
  className: string;
  smoothness?: number; // 新添加的属性，用于控制平滑度
}

const AnimatedChatBotLogo = ({ className, smoothness = 0.15, ...props }: AnimatedChatBotLogoProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect()
        setMousePosition({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const animate = () => {
    const targetX = (mousePosition.x - 256) / 256; // Normalize to [-1, 1]
    const targetY = (mousePosition.y - 256) / 256; // Normalize to [-1, 1]
    
    const newX = eyePosition.x + (targetX - eyePosition.x) * smoothness
    const newY = eyePosition.y + (targetY - eyePosition.y) * smoothness
    
    setEyePosition({ x: newX, y: newY })
    
    animationRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, smoothness])

  const calculateEyePosition = (baseX: number, baseY: number) => {
    return {
      x: baseX + eyePosition.x * 18,
      y: baseY + eyePosition.y * 18
    }
  }

  const leftEyePosition = calculateEyePosition(164, 256)
  const rightEyePosition = calculateEyePosition(344, 256)

  return (
    <div className={cn("relative", className)} {...props}>
      <svg
        ref={svgRef}
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full")}
      >
        <rect x="37" y="145" width="440" height="222" rx="62" fill="black"/>
        <rect x="37" y="145" width="440" height="222" rx="62" stroke="white" strokeWidth="42"/>
        <rect x="37" y="145" width="440" height="222" rx="62" stroke="black" strokeOpacity="0.2" strokeWidth="42"/>
        <circle cx={leftEyePosition.x} cy={leftEyePosition.y} r="50" fill="white" id="left-eye" />
        <circle cx={rightEyePosition.x} cy={rightEyePosition.y} r="50" fill="white" id="right-eye" />
        <circle cx={leftEyePosition.x} cy={leftEyePosition.y} r="25" fill="black" id="left-pupil" />
        <circle cx={rightEyePosition.x} cy={rightEyePosition.y} r="25" fill="black" id="right-pupil" />
        <path d="M192 46C192 34.9543 200.954 26 212 26H303C314.046 26 323 34.9543 323 46V54C323 65.0457 314.046 74 303 74H212C200.954 74 192 65.0457 192 54V46Z" fill="black" fillOpacity="0.85" id="forehead"/>
      </svg>
    </div>
  )
}

export default AnimatedChatBotLogo