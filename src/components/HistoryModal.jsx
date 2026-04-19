import { useState, useEffect } from 'react'

export default function HistoryModal({ onClose }) {
  const [records, setRecords] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tarot_history') || '[]')
    setRecords(saved)
  }, [])

  const handleDelete = (id) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('tarot_history', JSON.stringify(updated))
    setExpanded(null)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 200,
      overflowY: 'auto',
    }}>
      <div style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: '24px 20px',
      }}>
        {/* 头部 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, color: 'var(--accent)', fontWeight: 700 }}>
            📜 占卜日记
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid var(--card-border)',
              color: 'var(--text-primary)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>

        {records.length === 0 ? (
          <div className="empty-history">
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔮</p>
            <p>还没有占卜记录</p>
            <p style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>
              你的每一次占卜都会保存在这里
            </p>
          </div>
        ) : (
          <div className="history-list">
            {records.map(record => (
              <div key={record.id} className="history-item">
                <div className="history-meta">
                  <span className="history-date">{record.date}</span>
                  <span className="history-spread">{record.spreadName}</span>
                </div>
                <p className="history-question">"{record.question}"</p>

                {expanded === record.id ? (
                  <>
                    <div style={{
                      background: 'var(--card-bg)',
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 10,
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {record.reading}
                    </div>
                    <div className="history-actions">
                      <button onClick={() => handleDelete(record.id)}>🗑 删除</button>
                      <button onClick={() => setExpanded(null)}>收起 ↑</button>
                    </div>
                  </>
                ) : (
                  <div className="history-actions">
                    <button onClick={() => setExpanded(record.id)}>查看解读 ↓</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {records.length > 0 && (
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--text-secondary)',
            marginTop: 20,
          }}>
            最多保存最近 50 条记录
          </p>
        )}
      </div>
    </div>
  )
}
