import { useEffect, useRef } from 'react'

export default function ParticleLayer({ stage }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])

  const isParticleActive = ['buildup', 'reveal', 'celebration', 'fadeOut'].includes(stage)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#ffffff', '#8cecff', '#55d9ff', '#3d8cff', '#164da8']
    const particleCount = stage === 'celebration' ? 180 : 90

    class Particle {
      constructor() {
        this.reset(true)
      }

      reset(init = false) {
        // Explode outward from center or float upwards
        const centerX = canvas.width / 2
        const centerY = canvas.height * 0.55

        if (init || Math.random() > 0.4) {
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 4 + 1
          this.x = centerX
          this.y = centerY
          this.vx = Math.cos(angle) * speed
          this.vy = Math.sin(angle) * speed
        } else {
          this.x = Math.random() * canvas.width
          this.y = canvas.height + 10
          this.vx = (Math.random() - 0.5) * 2
          this.vy = -(Math.random() * 3 + 1)
        }

        this.size = Math.random() * 3.5 + 1.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.alpha = Math.random() * 0.8 + 0.2
        this.decay = Math.random() * 0.01 + 0.005
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.alpha -= this.decay

        if (this.alpha <= 0) {
          this.reset(false)
        }
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = Math.max(0, this.alpha)
        ctx.fillStyle = this.color
        ctx.shadowBlur = 8
        ctx.shadowColor = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    particlesRef.current = Array.from({ length: particleCount }, () => new Particle())

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach((p) => {
        p.update()
        p.draw()
      })
      animRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [stage])

  if (!isParticleActive) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 'var(--z-particle-layer)',
      }}
      aria-hidden="true"
    />
  )
}
