import { useState, useCallback, useRef, useEffect } from 'react'
import { ceremonyConfig } from '../data/ceremonyConfig'

export function useCeremonySequence() {
  const [ceremonyStage, setCeremonyStage] = useState('ready') // ready, activation, buildup, reveal, celebration, fadeOut, dark
  const timeoutsRef = useRef([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id))
    timeoutsRef.current = []
  }, [])

  const startCeremony = useCallback(() => {
    clearAllTimeouts()
    const { timeline, autoReset, autoResetDelay } = ceremonyConfig

    // 1. Activation immediately
    setCeremonyStage('activation')

    // 2. Buildup after activation duration
    const t1 = setTimeout(() => {
      setCeremonyStage('buildup')
    }, timeline.activation)
    timeoutsRef.current.push(t1)

    // 3. Reveal after buildup
    const t2 = setTimeout(() => {
      setCeremonyStage('reveal')
    }, timeline.activation + timeline.buildup)
    timeoutsRef.current.push(t2)

    // 4. Celebration
    const t3 = setTimeout(() => {
      setCeremonyStage('celebration')
    }, timeline.activation + timeline.buildup + timeline.reveal)
    timeoutsRef.current.push(t3)

    // 5. FadeOut
    const t4 = setTimeout(() => {
      setCeremonyStage('fadeOut')
    }, timeline.activation + timeline.buildup + timeline.reveal + timeline.celebration)
    timeoutsRef.current.push(t4)

    // 6. Completely Dark after fadeOut (10000ms)
    const t5 = setTimeout(() => {
      setCeremonyStage('dark')

      // Optional Auto Reset (Mode A vs Mode B)
      if (autoReset) {
        const tReset = setTimeout(() => {
          setCeremonyStage('ready')
        }, autoResetDelay)
        timeoutsRef.current.push(tReset)
      }
    }, timeline.activation + timeline.buildup + timeline.reveal + timeline.celebration + timeline.fadeOut)
    timeoutsRef.current.push(t5)
  }, [clearAllTimeouts])

  const resetCeremony = useCallback(() => {
    clearAllTimeouts()
    setCeremonyStage('ready')
  }, [clearAllTimeouts])

  useEffect(() => {
    return () => clearAllTimeouts()
  }, [clearAllTimeouts])

  return {
    ceremonyStage,
    startCeremony,
    resetCeremony,
    isCeremonyActive: ceremonyStage !== 'ready',
    isDark: ceremonyStage === 'dark',
  }
}
