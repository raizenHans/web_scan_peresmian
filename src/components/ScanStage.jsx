import ScanPoint from './ScanPoint'
import { ceremonyConfig } from '../data/ceremonyConfig'

export default function ScanStage({
  scanState,
  onCompletePoint,
  onTouchStart,
  onRightScanStart,
}) {
  const { scanPositions } = ceremonyConfig

  return (
    <div className="scan-stage" role="region" aria-label="Area Pindai Tangan Peresmian">
      <ScanPoint
        id="left"
        label={scanPositions.left.label}
        position={scanPositions.left}
        completed={scanState.left}
        onComplete={onCompletePoint}
        onTouchStart={onTouchStart}
      />

      <ScanPoint
        id="right"
        label={scanPositions.right.label}
        position={scanPositions.right}
        completed={scanState.right}
        onComplete={onCompletePoint}
        onTouchStart={() => {
          onTouchStart()
          if (onRightScanStart) onRightScanStart()
        }}
      />

      <ScanPoint
        id="center"
        label={scanPositions.center.label}
        position={scanPositions.center}
        completed={scanState.center}
        onComplete={onCompletePoint}
        onTouchStart={onTouchStart}
      />
    </div>
  )
}
