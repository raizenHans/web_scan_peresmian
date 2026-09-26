import wayangLeft from '../assets/wayang-kiri.svg'
import wayangRight from '../assets/wayang-kanan.svg'

export default function WayangDecoration({ isCeremonyActive = false }) {
  return (
    <>
      <img
        src={wayangLeft}
        alt="Wayang Kiri"
        className={`wayang-left ${isCeremonyActive ? 'ceremony-glow' : ''}`}
        aria-hidden="true"
      />
      <img
        src={wayangRight}
        alt="Wayang Kanan"
        className={`wayang-right ${isCeremonyActive ? 'ceremony-glow' : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
