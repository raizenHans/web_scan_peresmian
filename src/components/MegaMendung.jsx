import megaMendungCorner from '../assets/mega-mendung-corner.svg'
import centerOrnament from '../assets/center-bisatop.svg'

export default function MegaMendung({ isCeremonyActive = false }) {
  return (
    <>
      {/* Top Left Corner */}
      <img
        src={megaMendungCorner}
        alt="Mega Mendung Corner Left"
        className={`mega-mendung mega-mendung-corner top-left ${isCeremonyActive ? 'ceremony-glow' : ''}`}
        aria-hidden="true"
      />

      {/* Top Right Corner */}
      <img
        src={megaMendungCorner}
        alt="Mega Mendung Corner Right"
        className={`mega-mendung mega-mendung-corner top-right ${isCeremonyActive ? 'ceremony-glow' : ''}`}
        aria-hidden="true"
      />

      {/* Center Bottom Ornament */}
      <img
        src={centerOrnament}
        alt="Center Frame Ornament"
        className={`mega-mendung center-ornament ${isCeremonyActive ? 'ceremony-glow' : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
