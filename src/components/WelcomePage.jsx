import { useState, useEffect } from 'react'
import { dailyCard } from '../data/tarotData'

export default function WelcomePage({ onStart }) {
  const [daily, setDaily] = useState(null)

  useEffect(() => {
    setDaily(dailyCard())
  }, [])

  const isDay = localStorage.getItem('tarot-theme') !== 'day'

  return (
    <div className="welcome-page">
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
