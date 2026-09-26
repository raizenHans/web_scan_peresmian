export default function FinalDarkOverlay({ stage, onReset }) {
  const isFading = stage === 'fadeOut' || stage === 'dark'
  const isCompletelyDark = stage === 'dark'

  return (
    <div
      className={`final-dark-overlay ${isFading ? 'active' : ''}`}
      onClick={() => {
        if (isCompletelyDark && onReset) {
          onReset()
        }
      }}
    >
      {isCompletelyDark && (
        <div className="dark-mode-hint" title="Klik untuk mengulang">
          SENTUH LAYAR / TEKAN ESC UNTUK RESET
        </div>
      )}
    </div>
  )
}
