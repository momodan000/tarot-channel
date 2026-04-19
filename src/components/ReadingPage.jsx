import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'

const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const API_KEY = import.meta.env.VITE_SILICONFLOW_KEY || ''

const SYSTEM_PROMPT = `你是一位有20年经验的塔罗师，风格犀利直接，像一个敢说真话的老朋友。

【铁律】
1. 禁止说任何"正确的废话"——"顺其自然""保持积极心态""相信自己""注意沟通"这类话一个字都不准出现
2. 每张牌的解读必须结合用户的具体问题，给出ta可能没想到的角度和盲点
3. 逆位牌不要粉饰——直接说问题在哪，ta可能在逃避什么、在自欺什么
4. 行动建议必须具体到可以立刻去做的一个动作，不是空洞的方向
5. 如果牌面揭示了矛盾或冲突，直接指出来，不要和稀泥
6. 用第二人称"你"直接对话，像面对面聊天，不要用"问卜者""缘主"这种距离感称呼
7. 你的解读必须严格基于我提供的每张牌的关键词和含义，不得偏离牌的真实象征意义。可以延伸、可以犀利，但底层逻辑必须忠于牌义本身。
8. 如果用户的问题是选择题（A还是B、向左还是向右、要不要做某事），你必须基于牌面给出明确的倾向性判断，不允许说两边都可以或模棱两可。
9. 情感不只有爱情。用户问感情/情感/关系时，要根据问题的具体描述判断是爱情、亲情、友情、同事关系还是自我关系。不要默认把所有情感问题都当成恋爱问题。

【输出格式】
🔮 整体能量（1-2句话点明核心信息，要有冲击力）

🃏 逐张解读（每张牌2-3句：这张牌在这个位置说明什么，结合问题它在提醒你什么）

⚡ 牌面之间的张力（牌与牌之间有什么矛盾或呼应？这个组合在暗示什么？）——注意：如果只抽了1张牌，直接跳过这一段，不要输出这个标题。

🎯 真话时间（最犀利的一段：你可能不想听但需要听的话。直接指出盲点、自欺、或一直在回避的问题）

👣 下一步（一个具体的、今天就能做的行动。不是"多思考"，而是"今晚给那个人发一条消息"这种级别的具体）`

function buildUserMessage(question, spread, cards) {
  const cardDetails = cards.map((c, i) => {
    const pos = spread.positions[i]
    const orient = c.isReversed ? '逆位' : '正位'
    const meaning = c.isReversed ? c.reversed : c.upright
    return `- 位置${i + 1}（${pos.name}·${pos.meaning}）：${c.name} ${orient}\n  关键词：${c.keywords.join('、')}\n  含义：${meaning}`
  }).join('\n\n')

  return `【问题】${question}

【牌阵】${spread.name}（${spread.cardCount}张）
【指南】${spread.detail}

【牌义】
${cardDetails}

按以下格式深度解读：
🔮 整体能量（1-2句话）
🃏 逐张解读（结合问题）
⚡ 牌面张力（重点）
🎯 真话时间
👣 下一步`
}

export default function ReadingPage({ question, spread, drawnCards, reading, setReading, onBack, onHome }) {
  const [displayText, setDisplayText] = useState('')
  const [isLoading, setIsLoading] = useState(!reading)
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState(null)
  const readingRef = useRef(null)
  const hasCalledAI = useRef(false)

  // 流式调用AI
  const callAI = async () => {
    if (hasCalledAI.current) return
    hasCalledAI.current = true
    setIsLoading(true)

    const userMsg = buildUserMessage(question, spread, drawnCards)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-V3',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMsg },
          ],
          max_tokens: 1200,
          temperature: 0.85,
          stream: true,
        }),
      })

      if (!response.ok) throw new Error('API请求失败')
      if (!response.body) throw new Error('无响应体')

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const jsonStr = trimmed.slice(5).trim()
          if (jsonStr === '[DONE]' || !jsonStr) continue
          try {
            const parsed = JSON.parse(jsonStr)
            const delta = parsed?.choices?.[0]?.delta?.content
            if (delta) {
              fullText += delta
              setDisplayText(fullText)
              setReading(fullText)
            }
          } catch {}
        }
      }

      setDone(true)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setDone(true)
      setDisplayText('⚠️ AI解读暂时不可用，请稍后再试。\n\n牌面基本信息：\n\n' +
        drawnCards.map((c, i) =>
          `${spread.positions[i].name}：${c.name} ${c.isReversed ? '（逆位）' : '（正位）'}\n关键词：${c.keywords.join('、')}`
        ).join('\n\n')
      )
    }
  }

  useEffect(() => {
    if (reading) {
      setDisplayText(reading)
      setDone(true)
      setIsLoading(false)
    } else {
      callAI()
    }
  }, [])

  // 截图
  const handleScreenshot = async () => {
    try {
      const el = document.getElementById('reading-content')
      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: 2,
        backgroundColor: localStorage.getItem('tarot-theme') === 'day' ? '#fdf6e3' : '#0d0520',
        logging: false,
        allowTaint: false,
      })
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        setScreenshotUrl(url)
      }, 'image/png')
    } catch {}
  }

  // 保存日记
  const handleSave = () => {
    const record = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN'),
      spreadName: spread.name,
      question,
      cards: drawnCards,
      reading: displayText,
    }
    const existing = JSON.parse(localStorage.getItem('tarot_history') || '[]')
    localStorage.setItem('tarot_history', JSON.stringify([record, ...existing].slice(0, 50)))
    setSaved(true)
  }

  // 下载截图
  const handleDownload = () => {
    if (!screenshotUrl) return
    const a = document.createElement('a')
    a.href = screenshotUrl
    a.download = `tarot-${Date.now()}.png`
    a.click()
  }

  const isMobile = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)

  return (
    <div className="page" style={{ paddingTop: 16 }}>
      {/* 牌阵卡片展示 */}
      <div className="reading-cards-display">
        {drawnCards.map((c, i) => (
          <div key={i} className="reading-card-mini">
            <img src={c.image} alt={c.name} loading="lazy" />
            <div className="mini-label">
              {spread.positions[i].name} · {c.name}
              {c.isReversed ? ' ↺' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* 解读内容 */}
      <div id="reading-content">
        <div className="reading-output">
          {displayText || ''}
          {isLoading && (
            <span className="ai-thinking">
              <span className="typing-cursor" />
            </span>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="reading-actions">
        <button className="btn-primary" onClick={handleScreenshot} disabled={!done}>
          📸 {isMobile ? '长按保存' : '截图保存'}
        </button>
        <button className="btn-primary" onClick={handleSave} disabled={saved || !done}>
          {saved ? '✅ 已保存' : '💾 保存日记'}
        </button>
      </div>

      {saved && (
        <p className="save-success">已保存到占卜日记 💾</p>
      )}

      {/* 截图预览 */}
      {screenshotUrl && (
        <div className="screenshot-modal">
          <img src={screenshotUrl} alt="截图预览" />
          <p className="screenshot-hint">
            {isMobile ? (
              <>长按图片 → <strong>保存到相册</strong></>
            ) : (
              <>点击下方按钮下载图片</>
            )}
          </p>
          <div className="screenshot-actions">
            <button onClick={handleDownload}>⬇️ 下载</button>
            <button onClick={() => setScreenshotUrl(null)}>关闭</button>
          </div>
        </div>
      )}
    </div>
  )
}
