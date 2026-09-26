import { useRef, useEffect, useState, useCallback } from 'react'

export function useSoundEffects() {
  const audioContextRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx()
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }, [])

  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.25) => {
    if (isMuted) return
    initAudio()
    const ctx = audioContextRef.current
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)

      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio autoplay policy fallback
    }
  }, [initAudio, isMuted])

  // Play a sequence of chords
  const playChord = useCallback((frequencies, duration, type = 'sine', volume = 0.2) => {
    frequencies.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, duration, type, volume)
      }, idx * 45)
    })
  }, [playTone])

  // Sound bank
  const sounds = {
    // Touch start on point
    scanStart: () => {
      playTone(587.33, 0.15, 'sine', 0.2) // D5
    },

    // Point scan completed (5s finished)
    pointComplete: () => {
      // High-tech ascending confirmation chime
      playChord([523.25, 659.25, 783.99, 1046.5], 0.7, 'triangle', 0.25) // C5, E5, G5, C6
    },

    // 3 points completed, activation starts
    activation: () => {
      // Deep powerful tech crescendo
      playTone(130.81, 1.8, 'sawtooth', 0.15) // C3
      setTimeout(() => playChord([392.0, 523.25, 659.25], 1.2, 'sine', 0.2), 300)
    },

    // Reveal burst
    reveal: () => {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5, 1318.5]
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.5, 'sine', 0.18), i * 70)
      })
      setTimeout(() => playTone(1046.5, 2.0, 'triangle', 0.3), 600)
    },

    // Reset sound
    reset: () => {
      playTone(392.0, 0.1, 'sine', 0.15)
      setTimeout(() => playTone(261.63, 0.2, 'sine', 0.15), 100)
    },
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
      }
    }
  }, [])

  return {
    sounds,
    isMuted,
    toggleMute,
    initAudio,
  }
}
