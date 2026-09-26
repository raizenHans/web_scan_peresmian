export const ceremonyConfig = {
  holdDuration: 5000, // 5 seconds hold

  timeline: {
    activation: 2000,
    buildup: 3000,
    reveal: 3000,
    celebration: 4000,
    fadeOut: 10000,
  },

  scanPositions: {
    left: {
      id: 'left',
      label: 'SCAN KIRI',
      x: 23, // percentage of viewport width
      y: 52, // percentage of viewport height
    },
    right: {
      id: 'right',
      label: 'SCAN KANAN',
      x: 77,
      y: 52,
    },
    center: {
      id: 'center',
      label: 'SCAN TENGAH',
      x: 50,
      y: 70, // distinctly lower than left & right
    },
  },

  autoReset: false, // Mode B: stays dark until operator resets
  autoResetDelay: 3000,
}
