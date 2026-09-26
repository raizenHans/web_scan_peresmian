import logoSMK from '../assets/logo-smk.png'
import logoFKTP from '../assets/logo-ktp.svg'

export default function Header() {
  return (
    <header className="app-header">
      {/* Logos Row */}
      <div className="header-logos">
        {/* Logo SMK: Always inside a circular white container */}
        <div className="school-logo-wrapper" title="SMK">
          <img src={logoSMK} alt="Logo SMK" />
        </div>

        {/* Logo FKTP */}
        <div className="fktp-logo-wrapper" title="FKTP">
          <img src={logoFKTP} alt="Logo FKTP" />
        </div>
      </div>

      {/* Ceremony Main Title */}
      <h1 className="event-title">PERESMIAN</h1>

      {/* Forum Subtitle */}
      <div className="event-subtitle">
        FORUM KANCAH TEKNOLOGI PEMBANGUNAN
      </div>
    </header>
  )
}
