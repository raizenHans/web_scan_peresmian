import { useState, useEffect, useCallback } from 'react'
import Background from './components/Background'
import Header from './components/Header'
import WayangDecoration from './components/WayangDecoration'
import MegaMendung from './components/MegaMendung'
import ScanStage from './components/ScanStage'
import CeremonyOverlay from './components/CeremonyOverlay'
import FinalDarkOverlay from './components/FinalDarkOverlay'
import { useCeremonySequence } from './hooks/useCeremonySequence'
import { useSoundEffects } from './hooks/useSoundEffects'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import { ceremonyConfig } from './data/ceremonyConfig'
import './App.css'

// Preload critical visual assets
import wayangLeft from './assets/wayang-kiri.svg'
import wayangRight from './assets/wayang-kanan.svg'
import logoSMK from './assets/logo-smk.png'
import logoFKTP from './assets/logo-ktp.svg'
import megaMendungCorner from './assets/mega-mendung-corner.svg'
import centerOrnament from './assets/center-bisatop.svg'

function App() {
  const [scanState, setScanState] = useState({
    left: false,
    right: false,
    center: false,
  })

  const [presentationMode, setPresentationMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { ceremonyStage, startCeremony, resetCeremony, isCeremonyActive } = useCeremonySequence()
  const { sounds, isMuted, toggleMute, initAudio } = useSoundEffects()
  const { playOnRightScan, startFadeOut, reset: resetBackgroundMusic } = useBackgroundMusic()

  // Preload images on mount
  useEffect(() => {
    const assets = [
      wayangLeft,
      wayangRight,
      logoSMK,
      logoFKTP,
      megaMendungCorner,
      centerOrnament,
    ]
    assets.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Check if all 3 points are completed
  const allComplete = scanState.left && scanState.right && scanState.center

  useEffect(() => {
    if (allComplete && ceremonyStage === 'ready') {
      sounds.activation()
      startCeremony()
    }
  }, [allComplete, ceremonyStage, sounds, startCeremony])

  // Sound triggers on stage transitions
  useEffect(() => {
    if (ceremonyStage === 'reveal') {
      sounds.reveal()
    }
  }, [ceremonyStage, sounds])

  // Background music: fade out during fadeOut stage (10 seconds)
  useEffect(() => {
    if (ceremonyStage === 'fadeOut') {
      startFadeOut(10000) // 10 seconds fade out matching ceremony fadeOut duration
    }
  }, [ceremonyStage, startFadeOut])

  // Background music: ensure stopped when completely dark
  useEffect(() => {
    if (ceremonyStage === 'dark') {
      // Already faded out, but ensure cleanup
    }
  }, [ceremonyStage])

  // Handle single point completed
  const handleCompletePoint = useCallback(
    (pointId) => {
      sounds.pointComplete()
      setScanState((prev) => ({
        ...prev,
        [pointId]: true,
      }))
    },
    [sounds]
  )

  // Full reset for operator
  const handleFullReset = useCallback(() => {
    sounds.reset()
    resetBackgroundMusic()
    resetCeremony()
    setScanState({
      left: false,
      right: false,
      center: false,
    })
  }, [resetCeremony, resetBackgroundMusic, sounds])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    initAudio()
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      // Fallback if browser blocks fullscreen
    }
  }, [initAudio])

  // Keyboard controls for event operators
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Operator Reset: ESC or Ctrl+Shift+R
      if (e.key === 'Escape' || (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r'))) {
        handleFullReset()
      }
      // Toggle Presentation Mode: P
      if (e.key === 'p' || e.key === 'P') {
        if (!e.ctrlKey && !e.metaKey) {
          setPresentationMode((prev) => !prev)
        }
      }
      // Toggle Fullscreen: F
      if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey) {
          toggleFullscreen()
        }
      }
      // Toggle Audio: M
      if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.metaKey) {
          toggleMute()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFullReset, toggleFullscreen, toggleMute])

  // Sync presentation mode class to body for cursor hiding
  useEffect(() => {
    if (presentationMode) {
      document.body.classList.add('presentation-mode')
    } else {
      document.body.classList.remove('presentation-mode')
    }
  }, [presentationMode])

  return (
    <div className={`app-container ${isCeremonyActive ? 'ceremony-active' : ''}`}>
      {/* 1. Background Layers & Circuits */}
      <Background />

      {/* 2. Cultural Mega Mendung Ornaments */}
      <MegaMendung isCeremonyActive={isCeremonyActive} />

      {/* 3. Cultural Wayang Silhouettes (Left & Right) */}
      <WayangDecoration isCeremonyActive={isCeremonyActive} />

      {/* 4. Event Header (SMK Logo, FKTP Logo, Title) */}
      <Header />

      {/* 5. Interactive 3-Point Scan Stage */}
      <ScanStage
        scanState={scanState}
        onCompletePoint={handleCompletePoint}
        onTouchStart={sounds.scanStart}
        onRightScanStart={playOnRightScan}
      />

      {/* 6. Ceremony Overlay (Energy Beams, Core, Reveal, Celebration) */}
      <CeremonyOverlay stage={ceremonyStage} />

      {/* 7. Final 10-Second Fade to Dark */}
      <FinalDarkOverlay stage={ceremonyStage} onReset={handleFullReset} />

      {/* 8. Operator Controls (Discreet Bottom Right) */}
      <div className="operator-controls" aria-label="Kontrol Operator">
        <button
          className="ctrl-btn"
          onClick={toggleFullscreen}
          title="Layar Penuh (F)"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>

        <button
          className="ctrl-btn"
          onClick={toggleMute}
          title="Suara (M)"
        >
          {isMuted ? 'Muted' : 'Audio ON'}
        </button>

        <button
          className="ctrl-btn"
          onClick={() => setPresentationMode((prev) => !prev)}
          title="Mode Presentasi (P)"
        >
          {presentationMode ? 'Show Controls' : 'Kiosk Mode'}
        </button>

        <button
          className="ctrl-btn"
          onClick={handleFullReset}
          title="Reset (ESC)"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default App
