export default function EnergyCore({ stage }) {
  const isCoreVisible = ['activation', 'buildup', 'reveal', 'celebration', 'fadeOut'].includes(stage)
  const isExpanding = ['buildup', 'reveal', 'celebration'].includes(stage)

  if (!isCoreVisible) return null

  return (
    <>
      <div className={`energy-core-container ${isCoreVisible ? 'active' : ''}`}>
        <div className="core-glow" />
        <div className="core-ring core-ring-1" />
        <div className="core-ring core-ring-2" />
        <div className="core-ring core-ring-3" />
      </div>

      {isExpanding && (
        <>
          <div className="energy-expanding-ring" />
          <div className="energy-expanding-ring" />
          <div className="energy-expanding-ring" />
        </>
      )}
    </>
  )
}
