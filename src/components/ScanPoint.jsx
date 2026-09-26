import { useHoldProgress } from '../hooks/useHoldProgress'
import { ceremonyConfig } from '../data/ceremonyConfig'

export default function ScanPoint({
  id,
  label,
  position,
  completed = false,
  onComplete,
  onTouchStart,
}) {
  const { progress, holding, start, stop } = useHoldProgress(ceremonyConfig.holdDuration)

  const radius = 44
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - (completed ? 1 : progress))

  const handlePointerDown = (e) => {
    if (completed) return
    e.preventDefault()
    if (onTouchStart) onTouchStart()
    start(() => {
      if (onComplete) onComplete(id)
    })
  }

  const handlePointerUp = (e) => {
    e.preventDefault()
    stop()
  }

  const handlePointerCancel = (e) => {
    e.preventDefault()
    stop()
  }

  const handlePointerLeave = (e) => {
    e.preventDefault()
    stop()
  }

  return (
    <div
      className={`scan-point scan-point-${id} ${holding ? 'is-scanning' : ''} ${completed ? 'is-completed' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      role="button"
      tabIndex={completed ? -1 : 0}
      aria-label={`${label} - ${completed ? 'Terkonfirmasi' : holding ? 'Sedang memindai' : 'Tekan dan tahan 5 detik'}`}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !completed) {
          e.preventDefault()
          if (!holding) {
            if (onTouchStart) onTouchStart()
            start(() => {
              if (onComplete) onComplete(id)
            })
          }
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          stop()
        }
      }}
    >
      <div className="scan-pad">
        {/* Glow */}
        <div className="scan-pad-glow" />

        {/* Outer Ring */}
        <div className="scan-ring-outer" />

        {/* Rotating Tech Ring */}
        <div className="scan-ring-tech" />

        {/* Progress SVG Ring */}
        <svg className="scan-progress-svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8cecff" />
              <stop offset="50%" stopColor="#55d9ff" />
              <stop offset="100%" stopColor="#2676dc" />
            </linearGradient>
          </defs>
          <circle
            className="scan-progress-meter"
            cx="50"
            cy="50"
            r={radius}
          />
          <circle
            className="scan-progress-bar"
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Core Center Pad */}
        <div className="scan-core-pad">
          {/* Scanning Beam Sweep */}
          <div className="scan-beam-sweep" />

          {/* Hand Icon Graphic - Telapak Tangan */}
          <img
            src="/telapak_tangan.svg"
            alt="Telapak Tangan"
            className="scan-hand-svg"
            aria-hidden="true"
            draggable="false"
          />

          {/* Checkmark Graphic when Completed */}
          <div className="scan-completed-check">✓</div>
        </div>
      </div>

      {/* Label and Status Indicator */}
      <div className="scan-info">
        <div className="scan-title">{label}</div>
        <div className="scan-status-text">
          {completed
            ? 'TERKONFIRMASI'
            : holding
            ? `MEMINDAI... ${(Math.max(0, 5 - progress * 5)).toFixed(1)}S`
            : 'TEMPELKAN TANGAN'}
        </div>
      </div>
    </div>
  )
}
