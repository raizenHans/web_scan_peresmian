import { useRef, useEffect } from 'react'

export function useSoundEffects() {
  const audioContextRef = useRef(null)
  const enabledRef = useRef(true)

  // Initialize audio context on first user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }

  const playTone = (frequency, duration, type = 'sine', volume = 0.3, options = {}) => {
    if (!enabledRef.current) return
    initAudio()
    const ctx = audioContextRef.current
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    // Apply frequency modulation if provided
    if (options.fmFrequency && options.fmDepth) {
      const fmOsc = ctx.createOscillator()
      const fmGain = ctx.createGain()
      fmOsc.frequency.value = options.fmFrequency
      fmGain.gain.value = options.fmDepth
      fmOsc.connect(fmGain)
      fmGain.connect(oscillator.frequency)
      fmOsc.start()
      setTimeout(() => fmOsc.stop(), duration)
    }

    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }

  const playChord = (frequencies, duration, type = 'sine', volume = 0.2) => {
    frequencies.forEach((freq, i) => {
      setTimeout(() => playTone(freq, duration, type, volume), i * 30)
    })
  }

  // Sound effects
  const sounds = {
    // Scan start - subtle beep
    scanStart: () => playTone(800, 0.15, 'square', 0.25),

    // Scan progress - tick every second
    scanTick: () => playTone(1000, 0.08, 'sine', 0.15),

    // Scan complete - ascending chime
    scanComplete: () => {
      playChord([523.25, 659.25, 783.99, 1046.5], 0.6, 'sine', 0.25) // C5, E5, G5, C6
    },

    // All scans complete - fanfare
    fanfare: () => {
      // Major chord arpeggio up
      const notes = [
        523.25, 659.25, 783.99, 1046.5, // C5, E5, G5, C6
        1318.5, 1567.98, 2093.0, // E6, G6, C7
      ]
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.4, 'triangle', 0.2), i * 80)
      })
      // Add a low foundation
      setTimeout(() => playTone(261.63, 1.5, 'sine', 0.15), 200) // C4
    },

    // Error/invalid
    error: () => {
      playTone(300, 0.3, 'sawtooth', 0.3)
      setTimeout(() => playTone(250, 0.3, 'sawtooth', 0.3), 150)
    },

    // Ambient hum for active scan
    ambientHum: () => {
      initAudio()
      const ctx = audioContextRef.current
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.value = 60 // Low hum
      filter.type = 'lowpass'
      filter.frequency.value = 200
      gain.gain.value = 0.05

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start()

      return () => {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
        setTimeout(() => osc.stop(), 500)
      }
    },

    // Success sting
    success: () => {
      playChord([880, 1108.73, 1318.51], 0.8, 'triangle', 0.2) // A5, C#6, E6
    },
  }

  const toggleSound = () => {
    enabledRef.current = !enabledRef.current
    return enabledRef.current
  }

  const setEnabled = (enabled) => {
    enabledRef.current = enabled
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return { sounds, toggleSound, setEnabled, isEnabled: enabledRef.current }
}

// Simple hook for playing a specific sound
export function useSound(soundName) {
  const { sounds } = useSoundEffects()
  return sounds[soundName] || (() => {})
}