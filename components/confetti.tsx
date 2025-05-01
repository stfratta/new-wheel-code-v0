"use client"

import { useEffect, useState } from "react"
import type { JSX } from "react"

export function Confetti() {
  const [particles, setParticles] = useState<JSX.Element[]>([])
  const [trophies, setTrophies] = useState<JSX.Element[]>([])

  useEffect(() => {
    // Create confetti particles
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
    ]
    const newParticles: JSX.Element[] = []

    // Create 200 confetti particles (more particles for a better effect)
    for (let i = 0; i < 200; i++) {
      const left = Math.random() * 100
      const top = Math.random() * 100
      const size = Math.random() * 10 + 5
      const color = colors[Math.floor(Math.random() * colors.length)]
      const animationDuration = Math.random() * 3 + 2
      const animationDelay = Math.random() * 2

      // Mix of different shapes for more variety
      const shapeType = Math.random()
      let shape = "rect"
      if (shapeType < 0.33) shape = "circle"
      else if (shapeType < 0.66) shape = "triangle"

      newParticles.push(
        <div
          key={i}
          className="fixed z-50"
          style={{
            left: `${left}%`,
            top: `-5%`,
            width: `${size}px`,
            height: shape === "circle" ? `${size}px` : shape === "triangle" ? `${size * 1.2}px` : `${size * 1.5}px`,
            backgroundColor: shape === "triangle" ? "transparent" : color,
            borderRadius: shape === "circle" ? "50%" : "2px",
            borderLeft: shape === "triangle" ? `${size / 2}px solid transparent` : undefined,
            borderRight: shape === "triangle" ? `${size / 2}px solid transparent` : undefined,
            borderBottom: shape === "triangle" ? `${size}px solid ${color}` : undefined,
            position: "fixed",
            animation: `confetti-fall ${animationDuration}s ease-in forwards, confetti-shake 3s ease-in-out infinite alternate, confetti-rotate 1s linear infinite`,
            animationDelay: `${animationDelay}s`,
          }}
        />,
      )
    }

    // Create trophy/star animations that fly in from sides
    const newTrophies: JSX.Element[] = []
    for (let i = 0; i < 8; i++) {
      const side = i % 2 === 0 ? "left" : "right"
      const delay = Math.random() * 1.5
      const size = Math.random() * 20 + 30
      const top = 20 + Math.random() * 60 // Position between 20% and 80% from top

      newTrophies.push(
        <div
          key={`trophy-${i}`}
          className="fixed z-40"
          style={{
            [side]: "-10%",
            top: `${top}%`,
            animation: `trophy-fly-${side} 2.5s ease-out forwards`,
            animationDelay: `${delay}s`,
          }}
        >
          <div
            className="text-yellow-400 animate-pulse"
            style={{
              fontSize: `${size}px`,
              filter: "drop-shadow(0 0 10px rgba(234, 179, 8, 0.5))",
            }}
          >
            {i % 3 === 0 ? "🏆" : i % 3 === 1 ? "⭐" : "🎉"}
          </div>
        </div>,
      )
    }

    setParticles(newParticles)
    setTrophies(newTrophies)

    // Clean up after animation
    const timer = setTimeout(() => {
      setParticles([])
      setTrophies([])
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes confetti-shake {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(25px);
          }
        }
        
        @keyframes confetti-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes trophy-fly-left {
          0% {
            transform: translateX(0) rotate(-20deg) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          70% {
            transform: translateX(55vw) rotate(10deg) scale(1);
          }
          100% {
            transform: translateX(50vw) rotate(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes trophy-fly-right {
          0% {
            transform: translateX(0) rotate(20deg) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          70% {
            transform: translateX(-55vw) rotate(-10deg) scale(1);
          }
          100% {
            transform: translateX(-50vw) rotate(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Celebration background flash */}
      <div
        className="fixed inset-0 z-30 bg-gradient-to-b from-yellow-400/20 to-transparent pointer-events-none"
        style={{
          animation: "celebration-bg 4s ease-out forwards",
        }}
      />

      {trophies}
      {particles}
    </>
  )
}
