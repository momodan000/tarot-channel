import { useState, useEffect } from 'react'
import { dailyCard } from '../data/tarotData'

export default function TopNav({ show, onHome, onHistory }) {
  const [isDay, setIsDay] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tarot-theme') || 'night'
    setIsDay(saved === 'day')
  }, [])

  const toggleTheme = () => {
    const next = isDay ? 'night' : 'day'
    setIsDay(!isDay)
    document.body.className = next === 'day' ? 'theme-day' : 'theme-night'
    localStorage.setItem('tarot-theme', next)
  }

  if (!show) return null

  return (
    <>
      <nav className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontSize: 22,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ←
          </button>
          <span className="top-nav-title">钱钱的占星频道</span>
        </div>
        <button className="nav-btn" onClick={onHistory}>
          📜 占卜日记
        </button>
      </nav>

      <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
        {isDay ? '🌙' : '☀️'}
      </button>
    </>
  )
}
