import { useRef, useEffect, useCallback, useState } from 'react'

/**
 * 生成自然环境背景音（海浪/下雨/蝉鸣）
 * Web Audio API 原生实现，不依赖外部音频文件
 */

const SOUNDS = {
  ocean: {
    name: '海浪声',
    icon: '🌊',
    createNodes: (ctx, gain) => createOceanSound(ctx, gain),
  },
  rain: {
    name: '下雨声',
    icon: '🌧️',
    createNodes: (ctx, gain) => createRainSound(ctx, gain),
  },
  cicada: {
    name: '夏夜蝉鸣',
    icon: '🦗',
    createNodes: (ctx, gain) => createCicadaSound(ctx, gain),
  },
}

function createNoiseBuffer(ctx, seconds = 3) {
  const bufferSize = seconds * ctx.sampleRate
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

function createOceanSound(ctx, gainNode) {
  // 海浪：粉噪音 + LFO 调制
  const buffer = createNoiseBuffer(ctx, 4)
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 600

  // LFO 调制音量模拟海浪起伏
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.type = 'sine'
  lfo.frequency.value = 0.12 // 慢速起伏
  lfoGain.gain.value = 0.3

  const mixGain = ctx.createGain()
  mixGain.gain.value = 0.6

  lfo.connect(lfoGain)
  lfoGain.connect(mixGain.gain)
  src.connect(filter)
  filter.connect(mixGain)
  mixGain.connect(gainNode)

  src.start()
  lfo.start()

  return [src, lfo]
}

function createRainSound(ctx, gainNode) {
  // 暴雨：白噪音 + 带通滤波
  const buffer = createNoiseBuffer(ctx, 5)
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 3000
  filter.Q.value = 0.5

  // 次低频模拟雷声基底
  const subFilter = ctx.createBiquadFilter()
  subFilter.type = 'lowpass'
  subFilter.frequency.value = 200

  const subGain = ctx.createGain()
  subGain.gain.value = 0.4

  const mainGain = ctx.createGain()
  mainGain.gain.value = 0.5

  src.connect(filter)
  filter.connect(mainGain)
  mainGain.connect(gainNode)

  // 低频基底
  const subSrc = ctx.createBufferSource()
  subSrc.buffer = buffer
  subSrc.loop = true
  subSrc.connect(subFilter)
  subFilter.connect(subGain)
  subGain.connect(gainNode)

  src.start()
  subSrc.start()

  return [src, subSrc]
}

function createCicadaSound(ctx, gainNode) {
  // 夏夜：高频正弦 + 调频蝉鸣 + 环境底噪
  const nodes = []

  // 环境底噪（极轻的风声）
  const noiseBuffer = createNoiseBuffer(ctx, 3)
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuffer
  noiseSrc.loop = true
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.value = 4000
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.04
  noiseSrc.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(gainNode)
  noiseSrc.start()
  nodes.push(noiseSrc)

  // 蝉鸣音（多个不同频率的正弦波，调制出不规则的蝉鸣感）
  const cicadaFreqs = [2800, 3200, 3600, 4000, 4400]
  cicadaFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq

    // 每个频率的蝉鸣节奏不同
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 2 + i * 0.7 // 每个频率有不同节奏
    lfoGain.gain.value = freq * 0.0015

    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)

    oscGain.gain.value = 0.06 / (i + 1)
    osc.connect(oscGain)
    oscGain.connect(gainNode)

    osc.start()
    lfo.start()
    nodes.push(osc, lfo)
  })

  return nodes
}

export function useAmbientSounds() {
  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)
  const activeNodesRef = useRef([])
  const activeSoundRef = useRef(null)
  const isPlayingRef = useRef(false)

  const stopAll = useCallback(() => {
    activeNodesRef.current.forEach(node => {
      try { node.stop?.() } catch (e) {}
    })
    activeNodesRef.current = []
  }, [])

  const startSound = useCallback((soundKey) => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const gain = ctx.createGain()
      gain.gain.value = 0.5
      gain.connect(ctx.destination)
      gainNodeRef.current = gain
    }

    if (activeSoundRef.current === soundKey && isPlayingRef.current) return

    stopAll()

    const sound = SOUNDS[soundKey]
    if (!sound) return

    const nodes = sound.createNodes(audioCtxRef.current, gainNodeRef.current)
    activeNodesRef.current = nodes
    activeSoundRef.current = soundKey
    isPlayingRef.current = true
  }, [stopAll])

  const stop = useCallback(() => {
    stopAll()
    isPlayingRef.current = false
    activeSoundRef.current = null
  }, [stopAll])

  useEffect(() => {
    return () => {
      stopAll()
      audioCtxRef.current?.close()
    }
  }, [stopAll])

  return {
    SOUNDS,
    startSound,
    stop,
    activeSound: activeSoundRef,
    isPlaying: isPlayingRef,
  }
}
