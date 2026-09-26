import { useCallback, useRef, useState, useEffect } from 'react'

export function useHoldProgress(duration = 5000) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)

  const frameRef = useRef(null)
  const startRef = useRef(null)
  const onCompleteRef = useRef(null)

  const stop = useCallback(() => {
    setHolding(false)
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    startRef.current = null
    setProgress(0)
  }, [])

  const start = useCallback(
    (onComplete) => {
      if (holding) return

      onCompleteRef.current = onComplete
      setHolding(true)
      startRef.current = performance.now()

      const tick = (now) => {
        const elapsed = now - startRef.current
        const nextProgress = Math.min(elapsed / duration, 1)

        setProgress(nextProgress)

        if (nextProgress >= 1) {
          setHolding(false)
          frameRef.current = null
          startRef.current = null
          if (onCompleteRef.current) {
            onCompleteRef.current()
          }
          return
        }

        frameRef.current = requestAnimationFrame(tick)
      }

      frameRef.current = requestAnimationFrame(tick)
    },
    [duration, holding]
  )

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return {
    progress,
    holding,
    start,
    stop,
  }
}
