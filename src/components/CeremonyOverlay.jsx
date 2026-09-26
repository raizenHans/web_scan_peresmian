import EnergyCore from './EnergyCore'
import EnergyBeam from './EnergyBeam'
import ParticleLayer from './ParticleLayer'

export default function CeremonyOverlay({ stage }) {
  const isReveal = ['reveal', 'celebration', 'fadeOut'].includes(stage)
  const isFlash = stage === 'reveal'

  return (
    <>
      {/* 3 Energy Beams */}
      <EnergyBeam stage={stage} />

      {/* Central Core */}
      <EnergyCore stage={stage} />

      {/* Particle System */}
      <ParticleLayer stage={stage} />

      {/* Radial Flash Burst at the moment of reveal */}
      {isFlash && <div className="ceremony-flash" />}

      {/* Grand Title Reveal in the center */}
      {isReveal && (
        <div className="ceremony-reveal-title">
          <div className="ceremony-badge">RESMI DIBUKA</div>
          <h2 className="ceremony-main-title">PERESMIAN</h2>
          <div className="ceremony-sub-title">FORUM KANCAH TEKNOLOGI PEMBANGUNAN</div>
        </div>
      )}
    </>
  )
}
