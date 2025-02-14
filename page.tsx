"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

const Firework = ({ x, y }: { x: number; y: number }) => (
  <div className="absolute" style={{ left: x, top: y }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-pink-500 rounded-full"
        style={{
          width: "8px",
          height: "8px",
          animation: `firework 1s ease-out forwards`,
          animationDelay: `${Math.random() * 0.5}s`,
          transform: `rotate(${i * 18}deg) translateY(-100px)`,
        }}
      />
    ))}
  </div>
)

export default function ValentinePage() {
  const [answer, setAnswer] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const yesButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [floatOffset, setFloatOffset] = useState(0)
  const [fireworks, setFireworks] = useState<{ x: number; y: number }[]>([])
  const [isEscaping, setIsEscaping] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (answer === null && containerRef.current && noButtonRef.current && yesButtonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = noButtonRef.current.getBoundingClientRect()
      const yesButtonRect = yesButtonRef.current.getBoundingClientRect()

      // Set initial position next to the 'Yes' button
      if (noButtonPosition.x === 0 && noButtonPosition.y === 0) {
        setNoButtonPosition({
          x: yesButtonRect.right - containerRect.left + 20,
          y: yesButtonRect.top - containerRect.top,
        })
      }

      const moveButton = () => {
        const maxX = containerRect.width - buttonRect.width
        const maxY = containerRect.height - buttonRect.height

        const buttonCenterX = noButtonPosition.x + buttonRect.width / 2
        const buttonCenterY = noButtonPosition.y + buttonRect.height / 2

        const dx = mousePosition.x - containerRect.left - buttonCenterX
        const dy = mousePosition.y - containerRect.top - buttonCenterY

        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = 150 // Minimum distance to maintain

        let newX = noButtonPosition.x
        let newY = noButtonPosition.y

        if (distance < minDistance || isEscaping) {
          const angle = Math.atan2(dy, dx)
          const moveDistance = isEscaping ? 20 : Math.min(10, minDistance - distance)

          newX -= Math.cos(angle) * moveDistance
          newY -= Math.sin(angle) * moveDistance

          // Handle wall collisions
          if (newX <= 0) newX = maxX
          else if (newX >= maxX) newX = 0
          if (newY <= 0) newY = maxY
          else if (newY >= maxY) newY = 0

          // Check if the button is about to hit a corner
          const isNearCorner = (newX <= 10 || newX >= maxX - 10) && (newY <= 10 || newY >= maxY - 10)

          if (isNearCorner && !isEscaping) {
            setIsEscaping(true)
            setTimeout(() => setIsEscaping(false), 1000) // Escape for 1 second
          }

          if (isEscaping) {
            // Move towards the center when escaping
            const centerX = maxX / 2
            const centerY = maxY / 2
            newX += (centerX - newX) * 0.2
            newY += (centerY - newY) * 0.2
          }

          setNoButtonPosition({ x: newX, y: newY })
        }
      }

      const intervalId = setInterval(moveButton, 16) // 60 FPS
      return () => clearInterval(intervalId)
    }
  }, [answer, mousePosition, noButtonPosition, isEscaping])

  useEffect(() => {
    const floatAnimation = () => {
      setFloatOffset((prevOffset) => {
        const newOffset = prevOffset + 0.1
        return newOffset > Math.PI * 2 ? 0 : newOffset
      })
    }

    const intervalId = setInterval(floatAnimation, 50)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (answer === "yes") {
      const createFirework = () => {
        const x = Math.random() * window.innerWidth
        const y = Math.random() * window.innerHeight
        setFireworks((prev) => [...prev, { x, y }])
      }

      const intervalId = setInterval(createFirework, 300)
      setTimeout(() => clearInterval(intervalId), 3000)

      return () => clearInterval(intervalId)
    }
  }, [answer])

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-pink-100 overflow-hidden relative"
    >
      <h1 className="text-5xl font-bold text-pink-600 mb-8 font-game">Christina, will you be my Valentine?</h1>
      <div
        className="relative"
        style={{ transform: `translateY(${Math.sin(floatOffset) * 10}px)`, transition: "transform 0.05s ease-out" }}
      >
        <img
          src="/stitch-valentine.jpg"
          className="rounded-full border-4 border-blue-400 shadow-lg"
          style={{ height: "300px", width: "300px", objectFit: "cover" }}
        />
        {answer === null ? (
          <p className="text-lg font-medium text-gray-700 mt-4">Stitch is waiting for your answer!</p>
        ) : answer === "yes" ? (
          <div className="relative">
            {fireworks.map((fw, index) => (
              <Firework key={index} x={fw.x} y={fw.y} />
            ))}
            {Array.from({ length: 20 }).map((_, index) => (
              <Heart
                key={index}
                className="absolute text-pink-500"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 2 + 1}s ease-in-out infinite`,
                  animationDelay: `${Math.random()}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-lg font-medium text-red-600 mt-4">Oh no! Stitch is sad...</p>
        )}
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        {answer === null && (
          <>
            <Button
              ref={yesButtonRef}
              onClick={() => setAnswer("yes")}
              className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-4"
            >
              Yes <Heart className="ml-2 h-6 w-6" />
            </Button>
            <Button
              ref={noButtonRef}
              className="bg-red-500 text-white text-xl px-8 py-4 pointer-events-none"
              style={{
                position: "absolute",
                left: `${noButtonPosition.x}px`,
                top: `${noButtonPosition.y}px`,
                transition: "all 0.05s linear",
              }}
            >
              No
            </Button>
          </>
        )}
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <img
          key={index}
          src="/stitch-valentine.jpg?height=30&width=30"
          alt="Scrump"
          className="absolute pointer-events-none"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: `translate(-50%, -50%) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)`,
            opacity: 0.7 - index * 0.07,
            transition: "all 0.5s ease-out",
            transitionDelay: `${index * 50}ms`,
            width: "30px",
            height: "30px",
          }}
        />
      ))}
    </div>
  )
}
