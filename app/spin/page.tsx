"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Confetti } from "@/components/confetti"

export default function SpinPage() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<null | "win" | "lose">(null)
  const [rotation, setRotation] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const victoryAudioRef = useRef<HTMLAudioElement>(null)
  const whompAudioRef = useRef<HTMLAudioElement>(null)
  const tickingAudioRef = useRef<HTMLAudioElement>(null)

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }

      // Stop any playing audio safely
      if (tickingAudioRef.current) {
        try {
          if (!tickingAudioRef.current.paused) {
            tickingAudioRef.current.pause()
          }
        } catch (e) {
          console.log("Error cleaning up audio:", e)
        }
        tickingAudioRef.current.currentTime = 0
      }
    }
  }, [])

  // Function to determine if a rotation angle lands on a winning segment
  const isWinningSegment = (angle: number) => {
    // Normalize the angle to 0-360 range
    const normalizedAngle = ((angle % 360) + 360) % 360

    // Each segment is 30 degrees (12 segments total)
    // Even segments (0, 2, 4, 6, 8, 10) are green/winning segments
    const segmentIndex = Math.floor(normalizedAngle / 30)

    // For debugging
    console.log(
      "Normalized angle:",
      normalizedAngle,
      "Segment index:",
      segmentIndex,
      "Is winning:",
      segmentIndex % 2 === 0,
    )

    // Return true if segment index is even (green/winning)
    return segmentIndex % 2 === 0
  }

  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)
    setResult(null)
    setShowConfetti(false)

    // Start the ticking sound - with proper promise handling
    if (tickingAudioRef.current) {
      // Reset audio state
      tickingAudioRef.current.currentTime = 0
      tickingAudioRef.current.loop = true

      // Play with proper promise handling
      const playPromise = tickingAudioRef.current.play()

      // Handle the promise properly
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Playback prevented by browser", error)
          // We don't need to do anything special here - just prevent the unhandled rejection
        })
      }
    }

    // Calculate total rotation (previous + new spins + random angle)
    // We'll do at least 5 full rotations plus a random angle
    const spinCount = 5 + Math.random() * 3 // Between 5-8 full rotations
    const randomAngle = Math.random() * 360 // Random final position

    // Calculate total rotation
    const totalRotation = rotation + spinCount * 360 + randomAngle

    // Animation variables
    const startTime = performance.now()
    const duration = 13000 // 13 seconds
    const startRotation = rotation

    // Animation function with easing
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Custom easing function with more dramatic slowdown in last 5 seconds
      // First 5 seconds: faster
      // Middle 3 seconds: initial slowdown
      // Last 5 seconds: very slow for dramatic effect
      let easedProgress
      if (progress < 0.38) {
        // First ~5 seconds - maintain speed
        easedProgress = 0.38 * Math.pow(progress / 0.38, 0.8)
      } else if (progress < 0.62) {
        // Middle ~3 seconds - start slowing
        const t = (progress - 0.38) / 0.24 // normalize to 0-1 for middle section
        easedProgress = 0.38 + 0.24 * (1 - Math.pow(1 - t, 2))
      } else {
        // Last ~5 seconds - dramatic slowdown
        const t = (progress - 0.62) / 0.38 // normalize to 0-1 for final section
        easedProgress = 0.62 + 0.38 * (1 - Math.pow(1 - t, 5)) // Much stronger slowdown (power of 5)
      }

      const newRotation = startRotation + (totalRotation - startRotation) * easedProgress
      setCurrentRotation(newRotation)

      // Adjust ticking sound speed based on rotation speed
      if (tickingAudioRef.current && progress > 0.5) {
        // Gradually slow down the playback rate as the wheel slows
        // Make it even slower in the final phase
        const playbackRate =
          progress > 0.62
            ? Math.max(0.2, 1 - (progress - 0.5) * 1.6) // Slower in final phase
            : Math.max(0.5, 1 - (progress - 0.5) * 0.8)
        tickingAudioRef.current.playbackRate = playbackRate
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setRotation(newRotation)
        setSpinning(false)

        // Determine the result based on where the wheel landed
        // The pointer is at 0 degrees (right side), so we need to check the opposite of the wheel rotation
        // Since the wheel rotates clockwise, we need to check the opposite direction
        const pointerAngle = (360 - (newRotation % 360)) % 360
        const win = isWinningSegment(pointerAngle)

        console.log("Final rotation:", newRotation, "Pointer angle:", pointerAngle, "Win:", win)

        setResult(win ? "win" : "lose")

        // Stop ticking sound safely
        if (tickingAudioRef.current) {
          // Create a variable to track if we need to pause
          let shouldPause = true

          // Check if the audio is actually playing before pausing
          if (tickingAudioRef.current.paused || tickingAudioRef.current.ended) {
            shouldPause = false
          }

          if (shouldPause) {
            try {
              tickingAudioRef.current.pause()
            } catch (e) {
              console.log("Error pausing audio:", e)
            }
          }

          tickingAudioRef.current.currentTime = 0
        }

        // Play appropriate sound effect after a short delay
        setTimeout(() => {
          if (win) {
            setShowConfetti(true)
            if (victoryAudioRef.current) {
              const victoryPromise = victoryAudioRef.current.play()
              if (victoryPromise !== undefined) {
                victoryPromise.catch((error) => {
                  console.log("Victory sound prevented by browser", error)
                })
              }
            }
          } else {
            if (whompAudioRef.current) {
              const whompPromise = whompAudioRef.current.play()
              if (whompPromise !== undefined) {
                whompPromise.catch((error) => {
                  console.log("Whomp sound prevented by browser", error)
                })
              }
            }
          }
        }, 300)
      }
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col px-4 py-12">
      <Link href="/" className="mb-8 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-6 text-3xl font-bold">Spin the Wheel!</h1>
        <p className="mb-8 text-gray-600">
          Spin the wheel for a chance to get your Risk-it Shirt completely FREE! You'll either get 100% off (completely
          free) or no discount (regular price).
        </p>

        <div className="relative mx-auto mb-8 h-64 w-64 sm:h-80 sm:w-80">
          {/* Wheel Base */}
          <div className="absolute left-0 top-0 h-full w-full rounded-full border-8 border-gray-800 bg-gray-700"></div>

          {/* Wheel */}
          <div
            ref={wheelRef}
            className="absolute left-[5%] top-[5%] h-[90%] w-[90%] rounded-full overflow-hidden"
            style={{ transform: `rotate(${currentRotation}deg)` }}
          >
            {/* Segments - 12 alternating segments */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 h-full w-full"
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((i * 30 * Math.PI) / 180)}% ${50 + 50 * Math.sin((i * 30 * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((i + 1) * 30 * Math.PI) / 180)}% ${50 + 50 * Math.sin(((i + 1) * 30 * Math.PI) / 180)}%)`,
                  backgroundColor: i % 2 === 0 ? "#22c55e" : "#ef4444",
                }}
              >
                {/* Segment label with improved visibility */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    top: "20%",
                    left: "50%",
                    width: "80%",
                    height: "30%",
                    transform: `rotate(${i * 30 + 15}deg) translateX(-50%)`,
                    transformOrigin: "left bottom",
                  }}
                >
                  <div
                    className={`bg-black bg-opacity-30 rounded px-1 py-0.5 text-center ${i % 2 === 0 ? "text-white" : "text-white"}`}
                    style={{
                      transform: `rotate(${90 - (i * 30 + 15)}deg)`,
                      whiteSpace: "nowrap",
                      fontSize: "clamp(0.5rem, 1.5vw, 0.75rem)",
                      fontWeight: "bold",
                      textShadow: "0px 0px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {i % 2 === 0 ? "100% OFF" : "No Discount"}
                  </div>
                </div>
              </div>
            ))}

            {/* Notches/Dividers between segments */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`divider-${i}`}
                className="absolute top-0 left-[calc(50%-1px)] h-[50%] w-[2px] bg-gray-800 origin-bottom"
                style={{
                  transform: `rotate(${i * 30}deg)`,
                }}
              ></div>
            ))}

            {/* Center Circle */}
            <div className="absolute left-1/2 top-1/2 h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 z-10"></div>
          </div>

          {/* Pointer/Clicker */}
          <div className="absolute -right-6 top-1/2 h-12 w-12 -translate-y-1/2 transform z-20">
            <div className="relative h-full w-full">
              {/* Pointer base */}
              <div className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-yellow-500 border-2 border-yellow-600"></div>
              {/* Pointer arrow */}
              <div className="absolute left-0 top-1/2 h-0 w-0 -translate-y-1/2 border-b-[10px] border-l-[20px] border-t-[10px] border-b-transparent border-l-yellow-600 border-t-transparent"></div>
              {/* Clicker effect */}
              <div
                className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 bg-gray-800 transition-opacity duration-100 ${spinning ? "opacity-100 wheel-clicker" : "opacity-0"}`}
              ></div>
            </div>
          </div>
        </div>

        {result === null ? (
          <Button onClick={spinWheel} disabled={spinning} size="lg" className="mx-auto">
            {spinning ? "Spinning..." : "Spin the Wheel"}
          </Button>
        ) : (
          <Card className="mx-auto max-w-md">
            <CardContent className="pt-6">
              {result === "win" ? (
                <div className="text-center">
                  <h2 className="mb-4 text-2xl font-bold text-green-600 animate-bounce">Congratulations!</h2>
                  <div className="mb-6 text-lg relative">
                    <span className="relative z-10">You won 100% OFF! Your Risk-it Shirt is completely FREE!</span>
                    <span className="absolute inset-0 bg-yellow-200 opacity-30 animate-pulse rounded-lg"></span>
                  </div>
                  <p className="mb-6 text-sm text-gray-600">
                    We'll process your order right away and send you a confirmation email with the details.
                  </p>
                  <Link href="/">
                    <Button className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Return Home
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="mb-4 text-2xl font-bold text-gray-700">Better luck next time!</h2>
                  <p className="mb-6 text-lg">
                    You got No Discount. Your order will be processed at the regular price of $40.
                  </p>
                  <p className="mb-6 text-sm text-gray-600">
                    We'll process your order right away and send you a confirmation email with the details.
                  </p>
                  <Link href="/">
                    <Button className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Return Home
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sound effects */}
      <audio ref={victoryAudioRef} preload="auto" muted={false}>
        <source src="/sounds/victory.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={whompAudioRef} preload="auto" muted={false}>
        <source src="/sounds/whomp.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={tickingAudioRef} preload="auto" muted={false}>
        <source src="/sounds/ticking.mp3" type="audio/mpeg" />
      </audio>

      {showConfetti && <Confetti />}

      <style jsx global>{`
        @keyframes clickerSound {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .wheel-clicker {
          animation: clickerSound 0.1s infinite;
        }
      `}</style>
    </div>
  )
}
