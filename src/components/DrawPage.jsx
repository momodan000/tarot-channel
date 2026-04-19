import { useState, useEffect, useRef } from 'react'
import { drawCards } from '../data/tarotData'

const SHUFFLE_DURATION = 3000 // 洗牌动画3秒

export default function DrawPage({ question, spread, onBack, onNext }) {
  const [phase, setPhase] = useState('shuffle') // 'shuffle' | 'draw' | 'done'
  const [drawnCards, setDrawnCards] = useState([])
  const [flipping, setFlipping] = useState(null)
  const [shuffledDeck, setShuffledDeck] = useState([])
  const shuffleTimerRef = useRef(null)

  // 开始洗牌动画
  const startShuffle = () => {
    // 生成一副打乱的虚拟牌组用于动画
    const fullDeck = drawCards(78)
    setShuffledDeck(fullDeck)

    // 3秒后进入抽牌阶段
    shuffleTimerRef.current = setTimeout(() => {
      setPhase('draw')
    }, SHUFFLE_DURATION)
  }

  useEffect(() => {
    startShuffle()
    return () => {
      if (shuffleTimerRef.current) clearTimeout(shuffleTimerRef.current)
    }
  }, [])

  // 洗牌动画：随机切换显示的牌面
  const [shuffleDisplay, setShuffleDisplay] = useState(0)
  useEffect(() => {
    if (phase !== 'shuffle') return
    const interval = setInterval(() => {
      setShuffleDisplay(prev => (prev + 1) % shuffledDeck.length)
    }, 80)
    return () => clearInterval(interval)
  }, [phase, shuffledDeck])

  const handleDraw = (index) => {
    if (flipping !== null || drawnCards[index]) return
    if (phase !== 'draw') return

    const cards = drawCards(spread.cardCount)
    const card = cards[0]
    setFlipping(index)

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

  // 洗牌阶段
  if (phase === 'shuffle') {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="page-title">洗牌中...</h2>
          <p className="page-subtitle">
            请集中精神，默念你的问题<br />
            {Math.floor(SHUFFLE_DURATION / 1000)} 秒后开始抽牌
          </p>
        </div>

        {/* 洗牌动画区 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300,
          perspective: 1000,
        }}>
          <div className="shuffle-card">
            <div className={`card-front ${shuffleDisplay % 2 === 0 ? '' : 'flipped'}`}>
              {shuffledDeck.length > 0 && (
                <img
                  src={shuffledDeck[shuffleDisplay % shuffledDeck.length]?.image}
                  alt="洗牌中"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                borderRadius: '0 0 12px 12px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 12,
              }}>
                <span style={{ color: '#fff', fontSize: 12, letterSpacing: 2 }}>
                  洗 牌 中
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div style={{ margin: '0 auto', maxWidth: 200, marginTop: 32 }}>
          <div className="shuffle-progress-bar">
            <div className="shuffle-progress-fill" />
          </div>
        </div>
      </div>
    )
  }

  // 抽牌阶段
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
                  }}
                >
                  <img
                    src={drawnCards[i].image}
                    alt={drawnCards[i].name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none' }}
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
