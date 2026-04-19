import { useState } from 'react'

export default function QuestionPage({ onBack, onNext }) {
  const [q, setQ] = useState('')

  const handleNext = () => {
    if (!q.trim()) return
    onNext(q.trim())
  }

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          STEP 1 / 3
        </p>
        <h2 className="page-title">你在疑惑什么？</h2>
        <p className="page-subtitle">
          静下心，想清楚你的问题<br />
          越具体，塔罗的回应越清晰
        </p>
      </div>

      <textarea
        className="question-input"
        placeholder={"例如：\n· 我和TA的关系接下来会怎么发展？\n· 我该不该辞职去创业？\n· 这个项目的胜算有多大？"}
        value={q}
        onChange={e => setQ(e.target.value)}
        rows={6}
        maxLength={500}
        autoFocus
      />

      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24, textAlign: 'center' }}>
        {q.length} / 500
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!q.trim()}
        >
          下一步
        </button>
      </div>
    </div>
  )
}
