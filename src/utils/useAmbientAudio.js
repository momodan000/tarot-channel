import { useRef, useEffect, useCallback } from 'react'

/**
 * 生成冥想背景音（棕色噪音 + 低频OM共鸣）
 * 不依赖外部音频文件，浏览器原生实现
 */
export function useAmbientAudio() {
  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)
  const oscillatorsRef = useRef([])
  const isPlayingRef = useRef(false)

  const createBrownNoise = useCallback((ctx, gainNode) => {
    const bufferSize = 2 * ctx.sampleRate
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    
    let lastOut = 0.0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      // 棕色噪音：积分白噪音
      output[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = output[i]
      output[i] *= 3.5 // 增益补偿
    }
    
    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true
    
    // 低通滤波：让噪音更柔和
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400
    filter.Q.value = 1
    
    whiteNoise.connect(filter)
    filter.connect(gainNode)
    whiteNoise.start()
    
    return whiteNoise
  }, [])

  const createOMDrone = useCallback((ctx, gainNode) => {
    // OM drone: 多个谐波叠加创造深沉共鸣感
    const frequencies = [110, 165, 220, 330] // A2 及其谐波
    const oscillators = []
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      
      osc.type = i === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      // 谐波音量递减
      oscGain.gain.value = 0.15 / (i + 1)
      
      // 轻微颤音增加自然感
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.1 + i * 0.05
      lfoGain.gain.value = freq * 0.002
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()
      
      osc.connect(oscGain)
      oscGain.connect(gainNode)
      osc.start()
      oscillators.push(osc, lfo)
    })
    
    return oscillators
  }, [])

  const start = useCallback(() => {
    if (isPlayingRef.current) return
    
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      
      // 主增益节点（控制总体音量）
      const masterGain = ctx.createGain()
      masterGain.gain.value = 0.4
      masterGain.connect(ctx.destination)
      gainNodeRef.current = masterGain
      
      // 棕色噪音层
      createBrownNoise(ctx, masterGain)
      
      // OM共振层
      oscillatorsRef.current = createOMDrone(ctx, masterGain)
      
      isPlayingRef.current = true
    } catch (e) {
      console.warn('音频初始化失败:', e)
    }
  }, [createBrownNoise, createOMDrone])

  const stop = useCallback(() => {
    if (!isPlayingRef.current) return
    
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop() } catch (e) {}
      })
      oscillatorsRef.current = []
      gainNodeRef.current = null
      isPlayingRef.current = false
    } catch (e) {
      console.warn('音频关闭失败:', e)
    }
  }, [])

  // 组件卸载时确保关闭
  useEffect(() => {
    return () => stop()
  }, [stop])

  return { start, stop, isPlaying: isPlayingRef }
}
