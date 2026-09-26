export default function Background() {
  return (
    <div className="bg-container" aria-hidden="true">
      {/* Navy gradient layer */}
      <div className="bg-layer-gradient" />

      {/* Grid overlay */}
      <div className="bg-layer-grid" />

      {/* Central ambient breath pulse */}
      <div className="bg-ambient-pulse" />

      {/* Tech Circuit Network */}
      <div className="circuit-layer">
        {/* Horizontal Circuits */}
        <div className="circuit-line horizontal" style={{ top: '22%', left: '5%', width: '30%' }} />
        <div className="circuit-line horizontal" style={{ top: '22%', right: '5%', width: '30%' }} />
        <div className="circuit-line horizontal" style={{ top: '80%', left: '8%', width: '35%' }} />
        <div className="circuit-line horizontal" style={{ top: '80%', right: '8%', width: '35%' }} />

        {/* Vertical Circuits */}
        <div className="circuit-line vertical" style={{ top: '15%', left: '18%', height: '25%' }} />
        <div className="circuit-line vertical" style={{ top: '15%', right: '18%', height: '25%' }} />
        <div className="circuit-line vertical" style={{ top: '65%', left: '15%', height: '22%' }} />
        <div className="circuit-line vertical" style={{ top: '65%', right: '15%', height: '22%' }} />

        {/* Nodes */}
        <div className="circuit-node" style={{ top: '22%', left: '18%' }} />
        <div className="circuit-node" style={{ top: '22%', right: '18%' }} />
        <div className="circuit-node" style={{ top: '22%', left: '35%' }} />
        <div className="circuit-node" style={{ top: '22%', right: '35%' }} />
        <div className="circuit-node" style={{ top: '80%', left: '15%' }} />
        <div className="circuit-node" style={{ top: '80%', right: '15%' }} />
        <div className="circuit-node" style={{ top: '80%', left: '43%' }} />
        <div className="circuit-node" style={{ top: '80%', right: '43%' }} />
      </div>
    </div>
  )
}
