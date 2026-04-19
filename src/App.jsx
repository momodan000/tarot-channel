import { useState, useEffect } from 'react'
import { useAmbientSounds } from './utils/useAmbientSounds'
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
  const [activeSound, setActiveSound] = useState(null) // null | 'ocean' | 'rain' | 'cicada'
  const { SOUNDS, startSound, stop } = useAmbientSounds()

  const handleToggleSound = (soundKey) => {
    if (activeSound === soundKey) {
      stop()
      setActiveSound(null)
    } else {
      startSound(soundKey)
      setActiveSound(soundKey)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('tarot-theme') || 'night'
    document.body.className = saved === 'day' ? 'theme-day' : 'theme-night'
  }, [])

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
          activeSound={activeSound}
          onToggleSound={handleToggleSound}
          SOUNDS={SOUNDS}
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
