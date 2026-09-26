import { useRef, useEffect, useCallback } from 'react'

export function useBackgroundMusic() {
  const audioRef = useRef(null)
  const fadeIntervalRef = useRef(null)
  const isPlayingRef = useRef(false)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/instrument.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0
    audioRef.current.preload = 'auto'

    // Handle autoplay policy - try to play on first user interaction
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlayingRef.current) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked, will play when right scan starts
        })
      }
      document.removeEventListener('pointerdown', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('pointerdown', handleFirstInteraction, { once: true })
    document.addEventListener('keydown', handleFirstInteraction, { once: true })

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      document.removeEventListener('pointerdown', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [])

  const playOnRightScan = useCallback(() => {
    const audio = audioRef.current
    if (!audio || isPlayingRef.current) return

    isPlayingRef.current = true

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        isPlayingRef.current = false
      })
    }

    // Fade in over 2 seconds
    const fadeIn = () => {
      if (!audio || audio.volume >= 0.7) return
      audio.volume = Math.min(audio.volume + 0.035, 0.7) // ~2 seconds to reach 0.7
      if (audio.volume < 0.7) {
        requestAnimationFrame(fadeIn)
      }
    }
    fadeIn()
  }, [])

  const startFadeOut = useCallback((duration = 10000) => {
    const audio = audioRef.current
    if (!audio || !isPlayingRef.current) return

    const startVolume = audio.volume
    const startTime = Date.now()

    const fadeOut = () => {
      if (!audio || audio.volume <= 0) {
        audio.pause()
        audio.volume = 0
        isPlayingRef.current = false
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
        return
      }

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Exponential fade for more natural sound
      audio.volume = startVolume * Math.pow(1 - progress, 2)

      if (progress < 1) {
        requestAnimationFrame(fadeOut)
      } else {
        audio.pause()
        audio.volume = 0
        isPlayingRef.current = false
      }
    }

    fadeOut()
  }, [])

  const stopImmediately = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
    audio.pause()
    audio.volume = 0
    audio.currentTime = 0
    isPlayingRef.current = false
  }, [])

  const reset = useCallback(() => {
    stopImmediately()
    // Ready to play again on next right scan
  }, [stopImmediately])

  return {
    playOnRightScan,
    startFadeOut,
    stopImmediately,
    reset,
    isPlaying: isPlayingRef.current,
  }
}