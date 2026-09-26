import { useEffect, useRef, useState } from 'react'

export default function ScanCircle({
  position, // 'right' | 'left' | 'center'
  label,
  isActive,
  isCompleted,
  progress, // 0-1
  onComplete,
  holdDuration = 5000,
  size = 200,
}) {
  const [isPressing, setIsPressing] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdTimerRef = useRef(null)
  const progressTimerRef = useRef(null)
  const startTimeRef = useRef(null)
  const svgRef = useRef(null)

  const circumference = 2 * Math.PI * 80 // radius 80

  // Visual progress ring stroke
  const strokeDashoffset = circumference * (1 - (isActive ? holdProgress : progress))

  const startHold = (e) => {
    if (!isActive || isCompleted) return
    e.preventDefault()
    setIsPressing(true)
    startTimeRef.current = Date.now()

    // Timer untuk progress visual
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const p = Math.min(elapsed / holdDuration, 1)
      setHoldProgress(p)
      if (p >= 1) {
        completeHold()
      }
    }, 50)

    // Fallback timer
    holdTimerRef.current = setTimeout(() => {
      completeHold()
    }, holdDuration)
  }

  const endHold = () => {
    if (!isPressing) return
    setIsPressing(false)
    clearInterval(progressTimerRef.current)
    clearTimeout(holdTimerRef.current)
    setHoldProgress(0)
    startTimeRef.current = null
  }

  const completeHold = () => {
    clearInterval(progressTimerRef.current)
    clearTimeout(holdTimerRef.current)
    setIsPressing(false)
    setHoldProgress(1)
    startTimeRef.current = null
    onComplete?.()
  }

  // Touch & mouse events
  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    el.addEventListener('mousedown', startHold)
    el.addEventListener('touchstart', startHold, { passive: false })
    window.addEventListener('mouseup', endHold)
    window.addEventListener('touchend', endHold)
    window.addEventListener('touchcancel', endHold)

    return () => {
      el.removeEventListener('mousedown', startHold)
      el.removeEventListener('touchstart', startHold)
      window.removeEventListener('mouseup', endHold)
      window.removeEventListener('touchend', endHold)
      window.removeEventListener('touchcancel', endHold)
      clearInterval(progressTimerRef.current)
      clearTimeout(holdTimerRef.current)
    }
  }, [isActive, isCompleted])

  // Reset when becoming active
  useEffect(() => {
    if (isActive && !isCompleted) {
      setHoldProgress(0)
    }
  }, [isActive, isCompleted])

  const getColor = () => {
    if (isCompleted) return '#22c55e' // green
    if (isActive) return '#f59e0b' // amber
    return '#64748b' // slate
  }

  const getGlowColor = () => {
    if (isCompleted) return 'rgba(34, 197, 94, 0.6)'
    if (isActive) return 'rgba(245, 158, 11, 0.6)'
    return 'rgba(100, 116, 139, 0.3)'
  }

  return (
    <div
      className="scan-circle-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        flex: 1,
        maxWidth: size + 40,
      }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{
          cursor: isActive && !isCompleted ? 'grab' : 'default',
          filter: `drop-shadow(0 0 20px ${getGlowColor()})`,
          transition: 'filter 0.3s ease, transform 0.1s ease',
          transform: isPressing ? 'scale(0.95)' : 'scale(1)',
        }}
        role="button"
        aria-label={isCompleted ? `${label} selesai` : isActive ? `Tekan dan tahan ${label} selama 5 detik` : `${label} menunggu`}
        tabIndex={isActive && !isCompleted ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!isPressing) startHold(e)
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (isPressing) endHold()
          }
        }}
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
        />
        {/* Progress ring */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={getColor()}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 100 100)"
          style={{
            transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease',
            filter: isActive && !isCompleted ? 'drop-shadow(0 0 8px currentColor)' : 'none',
          }}
        />
        {/* Inner circle */}
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="#0f172a"
          stroke={getColor()}
          strokeWidth={isActive && !isCompleted ? 3 : 1}
          style={{ transition: 'stroke-width 0.2s ease' }}
        />
        {/* Hand icon or checkmark */}
        {isCompleted ? (
          <g transform="translate(100, 100) scale(1.2)">
            <path
              d="M -20 0 L -5 12 L 20 -15"
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'drawCheck 0.4s ease-out' }}
            />
            <style jsx>{`
              @keyframes drawCheck {
                from { stroke-dashoffset: 50; stroke-dasharray: 50; }
                to { stroke-dashoffset: 0; stroke-dasharray: 50; }
              }
            `}</style>
          </g>
        ) : (
          <g transform="translate(100, 100)" style={{ opacity: isActive ? 1 : 0.5 }}>
            {/* Hand palm */}
            <ellipse
              cx="0"
              cy="5"
              rx="18"
              ry="22"
              fill={isActive ? '#f59e0b' : '#64748b'}
            />
            {/* Thumb */}
            <ellipse
              cx="-20"
              cy="0"
              rx="8"
              ry="16"
              fill={isActive ? '#f59e0b' : '#64748b'}
              transform="rotate(-30 -20 0)"
            />
            {/* Fingers */}
            <g fill={isActive ? '#f59e0b' : '#64748b'}>
              <ellipse cx="-8" cy="-22" rx="5" ry="14" />
              <ellipse cx="0" cy="-26" rx="5" ry="16" />
              <ellipse cx="8" cy="-22" rx="5" ry="14" />
              <ellipse cx="16" cy="-16" rx="5" ry="12" transform="rotate(15 16 -16)" />
            </g>
            {/* Pulse animation when active */}
            {isActive && !isCompleted && (
              <circle
                cx="0"
                cy="5"
                r="55"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                style={{
                  animation: 'pulse 1.5s ease-out infinite',
                  opacity: 0.6,
                }}
              >
                <animate
                  attributeName="r"
                  from="30"
                  to="60"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )}
        <defs>
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.6; }
              100% { opacity: 0; }
            }
            @keyframes drawCheck {
              from { stroke-dashoffset: 50; stroke-dasharray: 50; }
              to { stroke-dashoffset: 0; stroke-dasharray: 50; }
            }
          `}</style>
        </defs>
      </svg>

      <div className="scan-label" style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 'clamp(18px, 3vw, 28px)',
            fontWeight: 700,
            color: getColor(),
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: 'color 0.3s ease',
          }}
        >
          {label}
        </div>
        {isActive && !isCompleted && (
          <div
            style={{
              fontSize: 'clamp(12px, 2vw, 16px)',
              color: '#94a3b8',
              marginTop: '4px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span style={{ animation: 'blink 1s infinite' }}>▼</span>
            <span>TEKAN DAN TAHAN</span>
            <span style={{ animation: 'blink 1s infinite' }}>▼</span>
            <style jsx>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
              }
            `}</style>
          </div>
        )}
        {isCompleted && (
          <div
            style={{
              fontSize: 'clamp(12px, 2vw, 16px)',
              color: '#22c55e',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>✓</span> SELESAI
          </div>
        )}
        {(!isActive || isCompleted) && !isCompleted && (
          <div
            style={{
              fontSize: 'clamp(12px, 2vw, 16px)',
              color: '#475569',
              marginTop: '4px',
            }}
          >
            {isActive ? 'MEMVALIDASI...' : 'MENUNGGU'}
          </div>
        )}
      </div>

      {/* Progress bar below */}
      {isActive && !isCompleted && (
        <div
          style={{
            width: '100%',
            maxWidth: size,
            height: '8px',
            background: '#1e293b',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              width: `${holdProgress * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              borderRadius: '4px',
              transition: 'width 0.1s linear',
              boxShadow: '0 0 10px #f59e0b',
            }}
          />
        </div>
      )}
    </div>
  )
}