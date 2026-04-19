import { useState, useEffect, useRef } from 'react'
import { useAmbientAudio } from './utils/useAmbientAudio'
import WelcomePage from './components/WelcomePage'
import QuestionPage from './components/QuestionPage'
import SpreadSelectPage from './components/SpreadSelectPage'
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

  // 读取主题
  useEffect(() => {
    const saved = localStorage.getItem('tarot-theme') || 'night'
    document.body.className = saved === 'day' ? 'theme-day' : 'theme-night'
  }, [])

  const goToQuestion = () => setPage('question')
  const goToSpreadSelect = (q) => {
    setQuestion(q)
    setPage('spread')
  }
  const goToDraw = (s) => {
    setSpread(s)
    setPage('draw')
  }
  const goToReading = (cards) => {
    setDrawnCards(cards)
    setPage('reading')
  }
  const goHome = () => setPage('welcome')

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
          onStart={goToQuestion}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={toggleMusic}
        />
      )}
      {page === 'question' && (
        <QuestionPage
          onBack={goHome}
          onNext={goToSpreadSelect}
        />
      )}
      {page === 'spread' && (
        <SpreadSelectPage
          question={question}
          onBack={() => setPage('question')}
          onNext={goToDraw}
        />
      )}
      {page === 'draw' && (
        <DrawPage
          question={question}
          spread={spread}
          onBack={() => setPage('spread')}
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
