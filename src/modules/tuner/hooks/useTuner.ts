import { useCallback, useEffect, useRef, useState } from 'react'

type TunerReading = {
  frequency: number | null
  note: string | null
  cents: number | null
  status: 'idle' | 'listening' | 'unsupported' | 'denied' | 'error'
}

const noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

function detectPitch(buffer: Float32Array, sampleRate: number) {
  let rms = 0
  for (const value of buffer) rms += value * value
  if (Math.sqrt(rms / buffer.length) < 0.012) return null

  const minLag = Math.floor(sampleRate / 1000)
  const maxLag = Math.floor(sampleRate / 70)
  let bestLag = -1
  let bestCorrelation = 0

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0
    let energy = 0
    for (let index = 0; index < buffer.length - lag; index += 1) {
      correlation += buffer[index] * buffer[index + lag]
      energy += buffer[index] * buffer[index]
    }
    const normalizedCorrelation = energy ? correlation / energy : 0
    if (normalizedCorrelation > bestCorrelation) { bestCorrelation = normalizedCorrelation; bestLag = lag }
  }

  return bestLag > 0 ? sampleRate / bestLag : null
}

export function useTuner() {
  const [reading, setReading] = useState<TunerReading>({ frequency: null, note: null, cents: null, status: 'idle' })
  const streamRef = useRef<MediaStream | null>(null)
  const frameRef = useRef<number | null>(null)
  const contextRef = useRef<AudioContext | null>(null)

  const stop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    contextRef.current?.close()
    frameRef.current = null
    streamRef.current = null
    contextRef.current = null
    setReading({ frequency: null, note: null, cents: null, status: 'idle' })
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setReading((current) => ({ ...current, status: 'unsupported' }))
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { autoGainControl: false, echoCancellation: false, noiseSuppression: false } })
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 2048
      const source = context.createMediaStreamSource(stream)
      source.connect(analyser)
      const buffer = new Float32Array(analyser.fftSize)
      streamRef.current = stream
      contextRef.current = context
      setReading({ frequency: null, note: null, cents: null, status: 'listening' })

      const readAudio = () => {
        analyser.getFloatTimeDomainData(buffer)
        const frequency = detectPitch(buffer, context.sampleRate)
        if (frequency) {
          const midi = Math.round(69 + 12 * Math.log2(frequency / 440))
          const target = 440 * 2 ** ((midi - 69) / 12)
          const cents = Math.round(1200 * Math.log2(frequency / target))
          setReading({ frequency, note: noteNames[((midi % 12) + 12) % 12], cents, status: 'listening' })
        }
        frameRef.current = requestAnimationFrame(readAudio)
      }
      readAudio()
    } catch (error) {
      const status = error instanceof DOMException && error.name === 'NotAllowedError' ? 'denied' : 'error'
      setReading((current) => ({ ...current, status }))
    }
  }, [])

  useEffect(() => stop, [stop])
  return { ...reading, start, stop }
}
