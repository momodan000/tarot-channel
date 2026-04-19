import { useState } from 'react'
import { drawCards } from '../data/tarotData'

export default function DrawPage({ question, spread, onBack, onNext }) {
  const [drawnCards, setDrawnCards] = useState([])
  const [flipping, setFlipping] = useState(null)
  const [flipped, setFlipped] = useState(false)

  const handleDraw = (index) => {
    if (flipping !== null || drawnCards[index]) return

    const cards = drawCards(spread.cardCount)
    const card = cards[0]
    setFlipping(index)
    setFlipped(true)

    setTimeout(() => {
      setDrawnCards(prev => {
        const next = [...prev]
        next[index] = card
        return next
      })
      setFlipping(null)
    }, 600)
  }

  const allDrawn = drawnCards.length === spread.cardCount && drawnCards.every(Boolean)

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          STEP 3 / 3
        </p>
        <h2 className="page-title">抽牌</h2>
        <p className="page-subtitle">
          点击下方卡槽抽取 {spread.cardCount} 张牌
        </p>
      </div>

      {/* 问题回顾 */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 12,
        padding: '10px 14px',
        marginBottom: 24,
        fontSize: 12,
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
      }}>
        {question}
      </div>

      {/* 牌阵展示 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {spread.positions.map((pos, i) => (
          <div key={i} style={{ textAlign: 'center', width: '100%' }}>
            <p className="position-label">{pos.name} · {pos.meaning}</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {drawnCards[i] ? (
                <div
                  className={`card-front ${flipping === i ? 'card-flipping' : ''}`}
                  style={{
                    width: 140,
                    height: 224,
                    transform: drawnCards[i]?.isReversed && !(flipping === i) ? 'rotate(180deg)' : undefined,
                  }}
                >
                  <img
                    src={drawnCards[i].image}
                    alt={drawnCards[i].name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="card-name-badge">
                    <span style={{ color: drawnCards[i].isReversed ? 'var(--negative)' : 'inherit' }}>
                      {drawnCards[i].name}
                      {drawnCards[i].isReversed && ' ↺逆位'}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`card-slot ${flipping === i ? 'card-flipping' : ''}`}
                  onClick={() => handleDraw(i)}
                >
                  🔮
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 抽牌提示 */}
      {!allDrawn && (
        <p className="draw-instruction">
          点击上方虚线框<br />抽取你的第 {drawnCards.length + 1} 张牌
        </p>
      )}

      {/* 全部抽完 */}
      {allDrawn && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button className="btn-primary" onClick={() => onNext(drawnCards)}>
            查看解读
          </button>
        </div>
      )}
    </div>
  )
}
