import { ceremonyConfig } from '../data/ceremonyConfig'

export default function EnergyBeam({ stage }) {
  const isBeamVisible = ['activation', 'buildup', 'reveal', 'celebration'].includes(stage)
  if (!isBeamVisible) return null

  const { left, right, center } = ceremonyConfig.scanPositions
  const coreX = 50
  const coreY = 55

  return (
    <svg className="energy-beams-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8cecff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#3d8cff" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Beam Left to Core */}
      <path
        className="energy-beam-path"
        d={`M ${left.x} ${left.y} Q ${left.x + 10} ${coreY} ${coreX} ${coreY}`}
      />

      {/* Beam Right to Core */}
      <path
        className="energy-beam-path"
        d={`M ${right.x} ${right.y} Q ${right.x - 10} ${coreY} ${coreX} ${coreY}`}
      />

      {/* Beam Center to Core */}
      <path
        className="energy-beam-path"
        d={`M ${center.x} ${center.y} L ${coreX} ${coreY}`}
      />
    </svg>
  )
}
