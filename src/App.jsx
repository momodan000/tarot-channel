import { useState, useEffect } from 'react'
import { useAmbientAudio } from './utils/useAmbientAudio'
import WelcomePage from './components/WelcomePage'
import SpreadSelectPage from './components/SpreadSelectPage'
import QuestionPage from './components/QuestionPage'
import DrawPage from './components/DrawPage'
import ReadingPage from './components/ReadingPage'
import TopNav from './components/TopNav'
import HistoryModal from './components/HistoryModal'

export default function App() {
  const [page, setPage] = useState('welcome')
  const [question, setQuestion] = useState('')
  const [spread, setSpread] = useState(null)
  const [drawnCards, setDrawnCards] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [reading, setReading] = useState('')
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const { start: startMusic, stop: stopMusic } = useAmbientAudio()

  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopMusic()
      setIsMusicPlaying(false)
    } else {
      startMusic()
      setIsMusicPlaying(true)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('tarot-theme') || 'night'
    document.body.className = saved === 'day' ? 'theme-day' : 'theme-night'
  }, [])

  // 流程：欢迎 → 选牌阵 → 写问题 → 抽牌 → 解读
  const goToSpread = () => setPage('spread')
  const goToQuestion = (s) => {
    setSpread(s)
    setPage('question')
  }
  const goToDraw = (q) => {
    setQuestion(q)
    setPage('draw')
  }
  const goToReading = (cards) => {
    setDrawnCards(cards)
    setPage('reading')
  }
  const goHome = () => {
    setPage('welcome')
    setQuestion('')
    setSpread(null)
  }

  const openHistory = () => setShowHistory(true)
  const closeHistory = () => setShowHistory(false)

  return (
    <>
      <TopNav
        show={page !== 'welcome'}
        onHome={goHome}
        onHistory={openHistory}
      />

      {page === 'welcome' && (
        <WelcomePage
          onStart={goToSpread}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={toggleMusic}
        />
      )}
      {page === 'spread' && (
        <SpreadSelectPage
          onBack={goHome}
          onNext={goToQuestion}
        />
      )}
      {page === 'question' && (
        <QuestionPage
          spread={spread}
          onBack={() => setPage('spread')}
          onNext={goToDraw}
        />
      )}
      {page === 'draw' && (
        <DrawPage
          question={question}
          spread={spread}
          onBack={() => setPage('question')}
          onNext={goToReading}
        />
      )}
      {page === 'reading' && (
        <ReadingPage
          question={question}
          spread={spread}
          drawnCards={drawnCards}
          reading={reading}
          setReading={setReading}
          onBack={() => setPage('draw')}
          onHome={goHome}
        />
      )}

      {showHistory && (
        <HistoryModal onClose={closeHistory} />
      )}
    </>
  )
}
