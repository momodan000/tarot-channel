import { useState, useEffect } from 'react'
import { dailyCard } from '../data/tarotData'

export default function WelcomePage({ onStart, isMusicPlaying, onToggleMusic }) {
  const [daily, setDaily] = useState(null)
  const [isDay, setIsDay] = useState(false)

  useEffect(() => {
    setDaily(dailyCard())
    const saved = localStorage.getItem('tarot-theme') || 'night'
    setIsDay(saved === 'day')
  }, [])

  const toggleTheme = () => {
    const next = isDay ? 'night' : 'day'
    setIsDay(!isDay)
    document.body.className = next === 'day' ? 'theme-day' : 'theme-night'
    localStorage.setItem('tarot-theme', next)
  }

  return (
    <div className="welcome-page">
      {/* 顶部设置栏 */}
      <div className="welcome-settings-bar">
        <button
          className="settings-btn"
          onClick={toggleTheme}
          title={isDay ? '切换夜间模式' : '切换日间模式'}
        >
          {isDay ? '🌙' : '☀️'}
        </button>
        <button
          className="settings-btn"
          onClick={onToggleMusic}
          title={isMusicPlaying ? '关闭背景音乐' : '开启背景音乐'}
        >
          {isMusicPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      <div style={{ marginBottom: 60 }}>
        <h1 className="welcome-title">钱钱的占星频道</h1>
        <p className="welcome-subtitle">78张韦特塔罗 · AI 深度解读</p>
      </div>

      {daily && (
        <div className="daily-card-area">
          <p className="daily-card-label">✦ 今日指引 ✦</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="card-front">
              <img
                src={daily.image}
                alt={daily.name}
                loading="lazy"
              />
              <div className="card-name-badge">{daily.nameEn}<br/>{daily.name}</div>
            </div>
            <p className="daily-card-name">{daily.name}</p>
            <p className="daily-card-meaning">{daily.upright}</p>
          </div>
        </div>
      )}

      <button className="btn-primary" onClick={onStart}>
        开始占卜
      </button>
    </div>
  )
}
