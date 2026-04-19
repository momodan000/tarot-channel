import { useState } from 'react'

const QUICK_PROMPTS = [
  { label: '💼 事业发展', text: '我在职业/事业上的发展方向如何？有什么需要注意的？' },
  { label: '💕 感情走向', text: '我和TA的关系走向会如何？' },
  { label: '✨ 本周运势', text: '我这周的总体运势如何？有什么需要留意的？' },
  { label: '💰 财富运势', text: '我的财务状况/投资方向需要注意什么？' },
  { label: '📚 学业/考试', text: '我的学业/考试结果会如何？该怎么准备？' },
  { label: '🤝 人际关系', text: '我与某人的人际关系该如何相处？' },
]

export default function QuestionPage({ spread, onBack, onNext }) {
  const [q, setQ] = useState('')

  const handleQuickPrompt = (text) => {
    setQ(text)
  }

  const handleNext = () => {
    if (!q.trim()) return
    onNext(q.trim())
  }

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          STEP 2 / 3
        </p>
        <h2 className="page-title">你在疑惑什么？</h2>
        <p className="page-subtitle">
          牌阵：{spread?.name || '未选择'}　·　
          静心冥想后，写下你的问题
        </p>
      </div>

      {/* 快捷提示 */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, textAlign: 'center' }}>
          ── 快捷问题模板 ──
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {QUICK_PROMPTS.map((item) => (
            <button
              key={item.label}
              className="quick-prompt-btn"
              onClick={() => handleQuickPrompt(item.text)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className="question-input"
        placeholder={"或写下你自己的问题：\n例如：我和TA的关系接下来会怎么发展？"}
        value={q}
        onChange={e => setQ(e.target.value)}
        rows={5}
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
          开始抽牌
        </button>
      </div>
    </div>
  )
}
