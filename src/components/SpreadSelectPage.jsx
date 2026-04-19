import { useState } from 'react'
import { spreads } from '../data/tarotData'

export default function SpreadSelectPage({ question, onBack, onNext }) {
  const [selected, setSelected] = useState(null)

  const handleNext = () => {
    if (selected === null) return
    onNext(spreads[selected])
  }

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          STEP 2 / 3
        </p>
        <h2 className="page-title">选择牌阵</h2>
        <p className="page-subtitle">
          你的问题：{question.length > 40 ? question.slice(0, 40) + '…' : question}
        </p>
      </div>

      <div className="spread-grid">
        {spreads.map((s, i) => (
          <div
            key={s.id}
            className={`spread-card ${selected === i ? 'selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            <div className="spread-icon">{s.icon}</div>
            <div className="spread-name">{s.name}</div>
            <div className="spread-desc">{s.description}</div>
            <div className="spread-count">{s.cardCount}张牌</div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 12,
          padding: '12px 16px',
          marginTop: 20,
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          <strong style={{ color: 'var(--accent)' }}>{spreads[selected].name}</strong>：{spreads[selected].detail}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={selected === null}
        >
          开始抽牌
        </button>
      </div>
    </div>
  )
}
