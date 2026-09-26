import { useEffect, useRef, useState } from 'react'

export default function ConfettiBurst({ isActive, count = 150, colors }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const defaultColors = [
    '#f59e0b', '#fbbf24', '#fcd34d', // gold/amber
    '#22c55e', '#4ade80', '#86efac', // green
    '#3b82f6', '#60a5fa', '#93c5fd', // blue
    '#ec4899', '#f472b6', '#f9a8d4', // pink
    '#ef4444', '#f87171', '#fca5a5', // red
    '#ffffff', '#f8fafc', // white
  ]

  const palette = colors || defaultColors

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setDimensions({ width: canvas.width, height: canvas.height })
    }
    resize()
    window.addEventListener('resize', resize)

    const ctx = canvas.getContext('2d')

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * dimensions.width
        this.y = -20
        this.size = Math.random() * 8 + 4
        this.color = palette[Math.floor(Math.random() * palette.length)]
        this.velocityY = Math.random() * 3 + 2
        this.velocityX = (Math.random() - 0.5) * 4
        this.rotation = Math.random() * 360
        this.rotationSpeed = (Math.random() - 0.5) * 10
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle'
        this.opacity = 1
        this.life = 1
        this.decay = Math.random() * 0.008 + 0.003
        this.wobble = Math.random() * 0.5 + 0.5
        this.wobbleSpeed = Math.random() * 0.05 + 0.02
      }

      update() {
        this.y += this.velocityY
        this.x += this.velocityX + Math.sin(Date.now() * this.wobbleSpeed) * this.wobble
        this.rotation += this.rotationSpeed
        this.velocityY += 0.05 // gravity
        this.life -= this.decay
        this.opacity = Math.max(0, this.life)

        if (this.life <= 0 || this.y > dimensions.height + 50) {
          this.reset()
          this.y = dimensions.height + Math.random() * 100
        }
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.fillStyle = this.color

        if (this.shape === 'rect') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }

    // Initialize particles
    if (isActive && particlesRef.current.length === 0) {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle())
      }
    }

    const animate = () => {
      if (!isActive && particlesRef.current.every(p => p.life <= 0)) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      particlesRef.current.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isActive, count, palette, dimensions])

  if (!isActive && particlesRef.current.every(p => p.life <= 0)) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 100,
      }}
      aria-hidden="true"
    />
  )
}