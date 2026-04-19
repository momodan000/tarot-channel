import { useState, useEffect } from 'react'
import { dailyCard } from '../data/tarotData'

export default function WelcomePage({ onStart, activeSound, onToggleSound, SOUNDS }) {
  const [daily, setDaily] = useState(null)
  const [isDay, setIsDay] = useState(false)
  const [showSoundPanel, setShowSoundPanel] = useState(false)

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

  const soundEntries = Object.entries(SOUNDS || {})

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
        <div className="sound-btn-wrapper">
          <button
            className="settings-btn"
            onClick={() => setShowSoundPanel(p => !p)}
            title="背景音效"
          >
            {activeSound ? SOUNDS[activeSound]?.icon : '🔇'}
          </button>
          {showSoundPanel && (
            <div className="sound-panel">
              <p className="sound-panel-title">选择背景音</p>
              {soundEntries.map(([key, sound]) => (
                <button
                  key={key}
                  className={`sound-option ${activeSound === key ? 'active' : ''}`}
                  onClick={() => {
                    onToggleSound(key)
                    setShowSoundPanel(false)
                  }}
                >
                  <span className="sound-option-icon">{sound.icon}</span>
                  <span className="sound-option-name">{sound.name}</span>
                  {activeSound === key && <span className="sound-option-playing">▶</span>}
                </button>
              ))}
              {activeSound && (
                <button
                  className="sound-option sound-option-stop"
                  onClick={() => {
                    onToggleSound(activeSound)
                    setShowSoundPanel(false)
                  }}
                >
                  🔇 停止
                </button>
              )}
            </div>
          )}
        </div>
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
