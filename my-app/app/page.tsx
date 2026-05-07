'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type Syllable = { zh: string; pinyin: string; tone: number; sound_hook: string }
type Word = {
  id: number
  chinese: string
  pinyin: string
  english: string
  mnemonic: string
  scene_emoji: string
  hsk_level: number
  topic: string
  syllables: Syllable[]
  audio_url: string
}

const TONE_COLORS = ['#c0392b', '#8e6a3a', '#2c7a4b', '#1a5a8a']

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [mode, setMode] = useState<'learn' | 'quiz' | 'home' | 'results'>('home')
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [saved, setSaved] = useState<Word[]>([])
  const [hskLevel, setHskLevel] = useState<any>('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [learned, setLearned] = useState<Set<number>>(new Set())
  const [progress, setProgress] = useState<Record<number, { learned: number, total: number }>>({})
  const [quizLevel, setQuizLevel] = useState<any>('all')
  const [quizCount, setQuizCount] = useState<number>(10)
  const [quizWords, setQuizWords] = useState<Word[]>([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [quizLoading, setQuizLoading] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<Word[]>([])
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setAuthChecked(true)
    })
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setAuthChecked(true)
    })
  }, [])

  useEffect(() => {
    if (user) {
      fetchLearned()
      fetchProgress()
    }
  }, [user])

  useEffect(() => {
    if (mode === 'learn') {
      if (hskLevel === 'saved') {
        setWords(saved); setCurrent(0); setFlipped(false)
      } else {
        fetchWords()
      }
    }
  }, [hskLevel, mode])

  async function fetchWords() {
    setLoading(true)
    let query = supabase.from('vocabulary').select('*')
    if (hskLevel !== 'all') query = query.eq('hsk_level', hskLevel)
    const { data } = await query
    setWords(data || [])
    setCurrent(0); setFlipped(false); setLoading(false)
  }

  async function fetchLearned() {
    if (!user) return
    const { data } = await supabase.from('progress').select('vocabulary_id').eq('user_id', user.id).eq('learned', true)
    setLearned(new Set((data || []).map(r => r.vocabulary_id)))
  }

  async function fetchProgress() {
    if (!user) return
    const { data: allWords } = await supabase.from('vocabulary').select('id, hsk_level')
    const { data: learnedData } = await supabase.from('progress').select('vocabulary_id').eq('user_id', user.id).eq('learned', true)
    const learnedIds = new Set((learnedData || []).map(r => r.vocabulary_id))
    const prog: Record<number, { learned: number, total: number }> = {}
    for (let lvl = 1; lvl <= 6; lvl++) {
      const levelWords = (allWords || []).filter(w => w.hsk_level === lvl)
      prog[lvl] = { learned: levelWords.filter(w => learnedIds.has(w.id)).length, total: levelWords.length }
    }
    setProgress(prog)
  }

  async function markLearned() {
    const word = words[current]
    if (!user || !word) return
    await supabase.from('progress').upsert({ user_id: user.id, vocabulary_id: word.id, learned: true, last_seen: new Date().toISOString() }, { onConflict: 'user_id,vocabulary_id' })
    setLearned(prev => new Set([...prev, word.id]))
    fetchProgress()
  }

  async function startQuiz() {
    setQuizLoading(true)
    let query = supabase.from('vocabulary').select('*')
    if (quizLevel !== 'all') query = query.eq('hsk_level', quizLevel)
    const { data } = await query
    const shuffled = (data || []).sort(() => Math.random() - 0.5)
    const selected = quizCount === 0 ? shuffled : shuffled.slice(0, quizCount)
    setQuizWords(selected)
    setQuizIndex(0); setScore(0); setStreak(0)
    setSelected(null); setWrongAnswers([])
    generateOptions(selected[0], data || [])
    setQuizLoading(false); setMode('quiz')
  }

  function generateOptions(word: Word, pool: Word[]) {
    const wrong = pool.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.english)
    setOptions([...wrong, word.english].sort(() => Math.random() - 0.5))
  }

  function handleAnswer(answer: string) {
    if (selected) return
    setSelected(answer)
    if (answer === quizWords[quizIndex].english) {
      setScore(s => s + 1); setStreak(s => s + 1)
    } else {
      setStreak(0)
      setWrongAnswers(prev => [...prev, quizWords[quizIndex]])
    }
  }

  function nextQuestion() {
    const next = quizIndex + 1
    if (next >= quizWords.length) { setMode('results'); return }
    setQuizIndex(next); setSelected(null)
    generateOptions(quizWords[next], quizWords)
  }

  function next() { setFlipped(false); setTimeout(() => setCurrent(i => (i + 1) % words.length), 150) }
  function prev() { setFlipped(false); setTimeout(() => setCurrent(i => (i - 1 + words.length) % words.length), 150) }
  function saveWord() { const word = words[current]; if (!saved.find(w => w.id === word.id)) setSaved([...saved, word]) }
  function removeWord(id: number) { setSaved(saved.filter(w => w.id !== id)) }
  function playAudio(url: string, e: React.MouseEvent) { e.stopPropagation(); new Audio(url).play() }

  const word = words[current]
  const isSaved = word && saved.find(w => w.id === word.id)
  const isLearned = word && learned.has(word.id)
  const quizWord = quizWords[quizIndex]

  const menuBtn: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 6, border: '1px solid',
    cursor: 'pointer', fontSize: 14, textAlign: 'left' as const,
    fontFamily: 'Georgia, serif', width: '100%', marginBottom: 4,
  }

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a', green: '#2c7a4b'
  }

  if (!authChecked) return null

  // HOME
  if (mode === 'home') return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ position: 'absolute' as const, top: 20, right: 20 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: s.lightbrown, fontFamily: 'Georgia, serif' }}>{user.email}</span>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/landing') }} style={{ fontSize: 12, color: s.muted, background: 'none', border: `1px solid ${s.border}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Sign out</button>
          </div>
        ) : (
          <button onClick={() => router.push('/auth')} style={{ fontSize: 13, color: s.brown, background: s.card, border: `1px solid ${s.border}`, borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Sign in</button>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: 11, color: s.red, letterSpacing: 4, marginBottom: 8 }}>普通话词汇助手</div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', letterSpacing: '-1px', marginBottom: 8 }}>记 · Remember</h1>
        <p style={{ fontSize: 15, color: s.muted, fontFamily: 'Georgia, serif' }}>Mandarin vocabulary with mnemonics</p>
      </div>

      {user && Object.keys(progress).length > 0 && (
        <div style={{ width: '100%', maxWidth: 480, marginBottom: '2rem' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, marginBottom: 12, textTransform: 'uppercase' }}>Your progress</div>
          {[1, 2, 3, 4, 5, 6].map(lvl => progress[lvl]?.total > 0 && (
            <div key={lvl} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: s.brown, fontFamily: 'Georgia, serif' }}>HSK {lvl}</span>
                <span style={{ fontSize: 12, color: s.lightbrown, fontFamily: 'Georgia, serif' }}>{progress[lvl].learned} / {progress[lvl].total}</span>
              </div>
              <div style={{ height: 6, background: s.border, borderRadius: 3 }}>
                <div style={{ height: '100%', background: s.green, borderRadius: 3, width: `${(progress[lvl].learned / progress[lvl].total) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 480 }}>
        <button onClick={() => { setMode('learn'); fetchWords() }} style={{ flex: 1, padding: '2rem 1rem', borderRadius: 12, border: `1px solid ${s.border}`, background: s.card, cursor: 'pointer', textAlign: 'center' as const, borderTop: `3px solid ${s.red}` }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', marginBottom: 4 }}>Learn</div>
          <div style={{ fontSize: 13, color: s.lightbrown, fontFamily: 'Georgia, serif' }}>Browse flashcards with mnemonics</div>
        </button>
        <button onClick={() => setMode('quiz' as any)} style={{ flex: 1, padding: '2rem 1rem', borderRadius: 12, border: `1px solid ${s.border}`, background: s.card, cursor: 'pointer', textAlign: 'center' as const, borderTop: `3px solid ${s.red}` }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🧠</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', marginBottom: 4 }}>Quiz</div>
          <div style={{ fontSize: 13, color: s.lightbrown, fontFamily: 'Georgia, serif' }}>Test your knowledge</div>
        </button>
      </div>

      {saved.length > 0 && (
        <div style={{ marginTop: 16, width: '100%', maxWidth: 480 }}>
          <button onClick={() => { setHskLevel('saved'); setMode('learn') }} style={{ width: '100%', padding: '1rem', borderRadius: 12, border: `1px solid ${s.border}`, background: s.card, cursor: 'pointer', textAlign: 'center' as const }}>
            <div style={{ fontSize: 14, color: s.brown, fontFamily: 'Georgia, serif' }}>⭐ Saved words ({saved.length})</div>
          </button>
        </div>
      )}
    </div>
  )

  // QUIZ SETUP
  if (mode === ('quiz' as any) && quizWords.length === 0) return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <button onClick={() => setMode('home')} style={{ position: 'absolute' as const, top: 24, left: 24, background: 'none', border: 'none', cursor: 'pointer', color: s.muted, fontSize: 14, fontFamily: 'Georgia, serif' }}>← Back</button>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', marginBottom: 8 }}>Quiz</h2>
        <p style={{ fontSize: 14, color: s.muted, fontFamily: 'Georgia, serif' }}>Choose your level and test yourself</p>
      </div>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, marginBottom: 12, textTransform: 'uppercase' }}>Select level</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          {(['all', 1, 2, 3, 4, 5, 6] as any[]).map(level => (
            <button key={level} onClick={() => setQuizLevel(level)} style={{ padding: '10px 6px', borderRadius: 8, border: '1px solid', borderColor: quizLevel === level ? s.red : s.border, background: quizLevel === level ? s.red : s.card, color: quizLevel === level ? '#fff' : s.brown, cursor: 'pointer', fontSize: 13, fontFamily: 'Georgia, serif' }}>
              {level === 'all' ? 'All' : `HSK ${level}`}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, marginBottom: 12, textTransform: 'uppercase' }}>Number of questions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          {[10, 25, 50, 0].map(count => (
            <button key={count} onClick={() => setQuizCount(count)} style={{ padding: '10px 6px', borderRadius: 8, border: '1px solid', borderColor: quizCount === count ? s.red : s.border, background: quizCount === count ? s.red : s.card, color: quizCount === count ? '#fff' : s.brown, cursor: 'pointer', fontSize: 13, fontFamily: 'Georgia, serif' }}>
              {count === 0 ? 'All' : count}
            </button>
          ))}
        </div>

        <button onClick={startQuiz} disabled={quizLoading} style={{ width: '100%', padding: '14px', borderRadius: 10, background: s.red, border: 'none', color: '#fff', fontSize: 16, fontFamily: 'Georgia, serif', cursor: 'pointer', fontWeight: 700 }}>
          {quizLoading ? 'Loading...' : 'Start Quiz →'}
        </button>
      </div>
    </div>
  )

  // RESULTS SCREEN
  if (mode === 'results') {
    const total = quizWords.length
    const pct = Math.round((score / total) * 100)
    const msg = pct === 100 ? 'Perfect score!' : pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort!' : pct >= 40 ? 'Keep practising!' : 'Keep going!'
    const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'

    return (
      <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
            <div style={{ fontSize: 14, color: s.lightbrown, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Quiz complete</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 4 }}>
              {score}<span style={{ fontSize: 24, color: s.lightbrown }}>/{total}</span>
            </div>
            <div style={{ fontSize: 18, color: s.red, marginBottom: 20, fontFamily: 'Georgia, serif' }}>{pct}% · {msg}</div>
            <div style={{ height: 8, background: s.border, borderRadius: 4, marginBottom: 24 }}>
              <div style={{ height: '100%', background: pct >= 60 ? s.green : s.red, borderRadius: 4, width: `${pct}%`, transition: 'width 0.8s' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setMode('quiz' as any); setQuizWords([]); setWrongAnswers([]) }} style={{ flex: 1, padding: '12px', borderRadius: 8, border: `1px solid ${s.border}`, background: s.bg, color: s.brown, fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                Try again
              </button>
              <button onClick={() => { setMode('home'); setQuizWords([]); setWrongAnswers([]) }} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: s.red, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                Home
              </button>
            </div>
          </div>

          {wrongAnswers.length > 0 && (
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, textTransform: 'uppercase', marginBottom: 12 }}>Words to review ({wrongAnswers.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {wrongAnswers.map((w, i) => (
                  <div key={i} style={{ background: s.card, border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.red}`, borderRadius: 8, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: s.text, fontFamily: 'serif' }}>{w.chinese}</span>
                        <span style={{ fontSize: 14, color: s.muted, fontFamily: 'Calibri, "Trebuchet MS", sans-serif' }}>{w.pinyin}</span>
                      </div>
                      <span style={{ fontSize: 13, color: s.lightbrown, textTransform: 'uppercase', letterSpacing: 1 }}>{w.english}</span>
                    </div>
                    <div style={{ fontSize: 13, color: s.brown, lineHeight: 1.6, fontStyle: 'italic' }}>{w.mnemonic}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // QUIZ QUESTION
  if (mode === 'quiz' && quizWord) return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={() => { setMode('home'); setQuizWords([]) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, fontSize: 14, fontFamily: 'Georgia, serif' }}>← Exit</button>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.red, fontFamily: 'Georgia, serif' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase' }}>Streak</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif' }}>{streak} 🔥</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase' }}>Progress</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif' }}>{quizIndex + 1}/{quizWords.length}</div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 520, height: 4, background: s.border, borderRadius: 2, marginBottom: '2rem' }}>
        <div style={{ height: '100%', background: s.red, borderRadius: 2, width: `${((quizIndex + 1) / quizWords.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 520, background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: s.lightbrown, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>What does this mean?</div>
        <div style={{ fontSize: 64, fontWeight: 700, color: s.text, lineHeight: 1, marginBottom: 10, fontFamily: 'serif' }}>{quizWord.chinese}</div>
        <div style={{ fontSize: 20, color: s.muted, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{quizWord.pinyin}</div>
        {quizWord.audio_url && (
          <button onClick={(e) => playAudio(quizWord.audio_url, e)} style={{ marginTop: 16, padding: '6px 18px', borderRadius: 24, border: `1px solid ${s.border}`, background: '#fff', cursor: 'pointer', fontSize: 13, color: s.muted, fontFamily: 'Georgia, serif' }}>🔊 Listen</button>
        )}
      </div>

      <div style={{ width: '100%', maxWidth: 520, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.5rem' }}>
        {options.map(option => {
          const isCorrect = option === quizWord.english
          const isSelected = option === selected
          let bg = s.card, border = s.border, color = s.brown
          if (selected) {
            if (isCorrect) { bg = '#f0faf5'; border = s.green; color = s.green }
            else if (isSelected) { bg = '#fdf0ee'; border = s.red; color = s.red }
          }
          return (
            <button key={option} onClick={() => handleAnswer(option)} style={{ padding: '14px 12px', borderRadius: 10, border: `1px solid ${border}`, background: bg, cursor: selected ? 'default' : 'pointer', fontSize: 14, color, fontFamily: 'Georgia, serif', textAlign: 'center' as const, transition: 'all 0.15s' }}>
              {isSelected ? (isCorrect ? '✓ ' : '✗ ') : ''}{option}
            </button>
          )
        })}
      </div>

      {selected && (
        <div style={{ width: '100%', maxWidth: 520, background: selected === quizWord.english ? '#f0faf5' : '#fdf0ee', border: `1px solid ${selected === quizWord.english ? s.green : '#e8c0b8'}`, borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: selected === quizWord.english ? s.green : s.red, marginBottom: 8, textTransform: 'uppercase' }}>
            {selected === quizWord.english ? '✓ Correct!' : `✗ The answer is "${quizWord.english}"`}
          </div>
          <div style={{ fontSize: 14, color: s.text, lineHeight: 1.7, marginBottom: 10, fontFamily: 'Georgia, serif' }}>{quizWord.mnemonic}</div>
          <div style={{ fontSize: 36, textAlign: 'center' }}>{quizWord.scene_emoji}</div>
        </div>
      )}

      {selected && (
        <button onClick={nextQuestion} style={{ width: '100%', maxWidth: 520, padding: '14px', borderRadius: 10, background: s.red, border: 'none', color: '#fff', fontSize: 16, fontFamily: 'Georgia, serif', cursor: 'pointer', fontWeight: 700 }}>
          {quizIndex + 1 >= quizWords.length ? 'Finish Quiz' : 'Next Question →'}
        </button>
      )}
    </div>
  )

  // LEARN
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: s.bg }}>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 10 }} />}

      <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: 256, background: '#fdf8f2', borderRight: `1px solid ${s.border}`, zIndex: 20, transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <button onClick={() => { setMenuOpen(false); setMode('home') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, fontSize: 13, textAlign: 'left' as const, marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>← Home</button>
        <div style={{ fontSize: 22, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', marginBottom: 4 }}>记 · Remember</div>
        <div style={{ fontSize: 11, color: s.red, letterSpacing: 3, marginBottom: '1.5rem' }}>普通话词汇助手</div>

        <div style={{ fontSize: 10, letterSpacing: 2, color: s.lightbrown, marginBottom: 10, textTransform: 'uppercase' }}>HSK Level</div>
        {(['all', 1, 2, 3, 4, 5, 6] as any[]).map(level => (
          <button key={level} onClick={() => { setHskLevel(level); setMenuOpen(false) }} style={{ ...menuBtn, borderColor: hskLevel === level ? s.red : s.border, background: hskLevel === level ? s.red : 'transparent', color: hskLevel === level ? '#fff' : s.brown }}>
            {level === 'all' ? 'All words' : `HSK ${level}`}
          </button>
        ))}

        <div style={{ fontSize: 10, letterSpacing: 2, color: s.lightbrown, margin: '1.5rem 0 10px', textTransform: 'uppercase' }}>My Words</div>
        <button onClick={() => { setHskLevel('saved'); setMenuOpen(false) }} style={{ ...menuBtn, borderColor: hskLevel === 'saved' ? s.red : s.border, background: hskLevel === 'saved' ? s.red : 'transparent', color: hskLevel === 'saved' ? '#fff' : s.brown }}>
          Saved words {saved.length > 0 && `(${saved.length})`}
        </button>

        {hskLevel === 'saved' && saved.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {saved.map(w => (
              <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: `1px solid ${s.border}` }}>
                <span style={{ fontSize: 20, color: s.text }}>{w.chinese}</span>
                <span style={{ fontSize: 12, color: s.lightbrown, flex: 1, marginLeft: 8 }}>{w.english}</span>
                <button onClick={() => removeWord(w.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.red, fontSize: 16 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <main style={{ flex: 1, maxWidth: 580, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: s.brown, padding: '4px 8px 4px 0' }}>☰</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>记 · Remember</h1>
            <div style={{ fontSize: 11, color: s.red, letterSpacing: 4, marginTop: 2 }}>普通话词汇助手</div>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: s.lightbrown }}>Loading...</div>
        ) : words.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: s.lightbrown }}>
            {hskLevel === 'saved' ? 'No saved words yet.' : 'No words found.'}
          </div>
        ) : word ? (
          <>
            <div onClick={() => setFlipped(!flipped)} style={{ background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${isLearned ? s.green : s.red}`, borderRadius: 12, padding: '2.5rem 2rem', marginBottom: '1rem', cursor: 'pointer', minHeight: 320, transition: 'box-shadow 0.2s', boxShadow: flipped ? '0 8px 32px rgba(192,57,43,0.08)' : '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: isLearned ? s.green : s.red, textTransform: 'uppercase' }}>{isLearned ? '✓ Learned' : `HSK ${word.hsk_level}`}</div>
                <div style={{ fontSize: 10, letterSpacing: 1, color: s.lightbrown, textTransform: 'uppercase', background: '#f5ede4', padding: '3px 10px', borderRadius: 4 }}>{word.topic}</div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 72, fontWeight: 700, color: s.text, lineHeight: 1, marginBottom: 12, fontFamily: 'serif' }}>{word.chinese}</div>
                <div style={{ fontSize: 22, color: s.muted, marginBottom: 6, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{word.pinyin}</div>
                <div style={{ fontSize: 16, color: s.lightbrown, letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>{word.english}</div>
                {word.audio_url && (
                  <button onClick={(e) => playAudio(word.audio_url, e)} style={{ padding: '7px 20px', borderRadius: 24, border: `1px solid ${s.border}`, background: '#fff', cursor: 'pointer', fontSize: 13, color: s.muted, fontFamily: 'Georgia, serif' }}>🔊 Listen</button>
                )}
              </div>

              {flipped ? (
                <div style={{ borderTop: `1px solid ${s.border}`, paddingTop: '1.5rem' }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, marginBottom: 10, textTransform: 'uppercase' }}>Mnemonic</div>
                  <div style={{ fontSize: 15, lineHeight: 1.8, color: '#3d2010', marginBottom: '1.25rem' }}>{word.mnemonic}</div>
                  <div style={{ fontSize: 44, textAlign: 'center', padding: '1.25rem', background: '#f5ede4', borderRadius: 8 }}>{word.scene_emoji}</div>
                  {word.syllables && word.syllables.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                      {word.syllables.map((s2, i) => (
                        <div key={i} style={{ flex: 1, padding: '10px 12px', border: `1px solid ${s.border}`, borderRadius: 8, textAlign: 'center', background: '#fff' }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: s.text, fontFamily: 'serif' }}>{s2.zh}</div>
                          <div style={{ fontSize: 13, color: s.muted, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{s2.pinyin}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: TONE_COLORS[s2.tone - 1] }}>"{s2.sound_hook}"</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', fontSize: 13, color: '#c8a888', fontStyle: 'italic', marginTop: '1rem' }}>tap to reveal mnemonic</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              <button onClick={prev} style={{ flex: 1, height: 48, borderRadius: 8, border: `1px solid ${s.border}`, background: s.card, cursor: 'pointer', fontSize: 20, color: s.brown }}>←</button>
              <button onClick={saveWord} style={{ flex: 1, height: 48, borderRadius: 8, border: `1px solid ${isSaved ? s.red : s.border}`, background: isSaved ? '#fdf0ee' : s.card, cursor: 'pointer', fontSize: 13, color: isSaved ? s.red : s.brown, fontFamily: 'Georgia, serif' }}>
                {isSaved ? 'Saved ✓' : 'Save'}
              </button>
              {user && (
                <button onClick={markLearned} style={{ flex: 1, height: 48, borderRadius: 8, border: `1px solid ${isLearned ? s.green : s.border}`, background: isLearned ? '#f0faf5' : s.card, cursor: 'pointer', fontSize: 13, color: isLearned ? s.green : s.brown, fontFamily: 'Georgia, serif' }}>
                  {isLearned ? 'Learned ✓' : 'Learned'}
                </button>
              )}
              <button onClick={next} style={{ flex: 1, height: 48, borderRadius: 8, border: `1px solid ${s.border}`, background: s.card, cursor: 'pointer', fontSize: 20, color: s.brown }}>→</button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#c8a888', letterSpacing: 1 }}>{current + 1} / {words.length}</div>
          </>
        ) : null}
      </main>
    </div>
  )
}