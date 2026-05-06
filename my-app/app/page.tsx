'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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

const TONE_COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#D4537E']

export default function Home() {
  const [words, setWords] = useState<Word[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [saved, setSaved] = useState<Word[]>([])
  const [hskLevel, setHskLevel] = useState<any>('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hskLevel === 'saved') {
      setWords(saved)
      setCurrent(0)
      setFlipped(false)
      setLoading(false)
    } else {
      fetchWords()
    }
  }, [hskLevel, saved])

  async function fetchWords() {
    setLoading(true)
    let query = supabase.from('vocabulary').select('*')
    if (hskLevel !== 'all') query = query.eq('hsk_level', hskLevel)
    const { data } = await query
    setWords(data || [])
    setCurrent(0)
    setFlipped(false)
    setLoading(false)
  }

  function next() {
    setFlipped(false)
    setTimeout(() => setCurrent(i => (i + 1) % words.length), 150)
  }

  function prev() {
    setFlipped(false)
    setTimeout(() => setCurrent(i => (i - 1 + words.length) % words.length), 150)
  }

  function saveWord() {
    const word = words[current]
    if (!saved.find(w => w.id === word.id)) {
      setSaved([...saved, word])
    }
  }

  function removeWord(id: number) {
    setSaved(saved.filter(w => w.id !== id))
  }

  function playAudio(url: string, e: React.MouseEvent) {
    e.stopPropagation()
    new Audio(url).play()
  }

  const word = words[current]
  const isSaved = word && saved.find(w => w.id === word.id)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 10
        }} />
      )}

      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: 240,
        background: '#fff', borderRight: '1px solid #eee', zIndex: 20,
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease', padding: '2rem 1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        overflowY: 'auto'
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: '1.5rem' }}>记 · Remember</div>

        <div style={{ fontSize: 11, letterSpacing: 2, color: '#bbb', marginBottom: 8, textTransform: 'uppercase' }}>HSK Level</div>
        {(['all', 1, 2, 3, 4, 5, 6] as any[]).map(level => (
          <button key={level} onClick={() => { setHskLevel(level); setMenuOpen(false) }} style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid',
            borderColor: hskLevel === level ? '#333' : '#eee',
            background: hskLevel === level ? '#333' : 'transparent',
            color: hskLevel === level ? '#fff' : '#555',
            cursor: 'pointer', fontSize: 14, textAlign: 'left',
            fontFamily: 'Georgia, serif'
          }}>
            {level === 'all' ? 'All words' : `HSK ${level}`}
          </button>
        ))}

        <div style={{ fontSize: 11, letterSpacing: 2, color: '#bbb', margin: '1.5rem 0 8px', textTransform: 'uppercase' }}>My Words</div>
        <button onClick={() => { setHskLevel('saved'); setMenuOpen(false) }} style={{
          padding: '8px 14px', borderRadius: 8, border: '1px solid',
          borderColor: hskLevel === 'saved' ? '#333' : '#eee',
          background: hskLevel === 'saved' ? '#333' : 'transparent',
          color: hskLevel === 'saved' ? '#fff' : '#555',
          cursor: 'pointer', fontSize: 14, textAlign: 'left',
          fontFamily: 'Georgia, serif'
        }}>
          Saved words {saved.length > 0 && `(${saved.length})`}
        </button>

        {hskLevel === 'saved' && saved.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {saved.map(w => (
              <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', fontSize: 14 }}>
                <span style={{ fontSize: 18 }}>{w.chinese}</span>
                <button onClick={() => removeWord(w.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 16 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <main style={{ flex: 1, maxWidth: 560, margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => setMenuOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, padding: '4px 8px', color: '#333'
          }}>☰</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: 26, fontWeight: 700 }}>记 · Remember</h1>
            <p style={{ color: '#888', fontSize: 13, letterSpacing: 3 }}>普通话词汇助手</p>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading...</div>
        ) : words.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            {hskLevel === 'saved' ? 'No saved words yet.' : 'No words found.'}
          </div>
        ) : word ? (
          <>
            <div onClick={() => setFlipped(!flipped)} style={{
              background: '#fff', border: '1px solid #eee', borderRadius: 16,
              padding: '2rem 1.5rem', marginBottom: '1rem', cursor: 'pointer',
              minHeight: 300, transition: 'box-shadow 0.2s',
              boxShadow: flipped ? '0 4px 24px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)'
            }}>

              <div style={{ textAlign: 'center', marginBottom: flipped ? '1.5rem' : '0' }}>
                <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1, marginBottom: 10 }}>{word.chinese}</div>
                <div style={{ fontSize: 22, color: '#555', marginBottom: 6, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{word.pinyin}</div>
                <div style={{ fontSize: 16, color: '#999', marginBottom: 8 }}>{word.english}</div>
                <div style={{ fontSize: 11, color: '#ccc', letterSpacing: 1, marginBottom: 12 }}>HSK {word.hsk_level}</div>

                {word.audio_url && (
                  <button
                    onClick={(e) => playAudio(word.audio_url, e)}
                    style={{
                      padding: '8px 20px', borderRadius: 20,
                      border: '1px solid #ddd', background: 'transparent',
                      cursor: 'pointer', fontSize: 13, color: '#666',
                      fontFamily: 'Georgia, serif'
                    }}>
                    🔊 Listen
                  </button>
                )}
              </div>

              {flipped && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '1.25rem 0' }} />
                  <div style={{ fontSize: 11, letterSpacing: 2, color: '#bbb', marginBottom: 8, textTransform: 'uppercase' }}>Mnemonic</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: '1rem' }}>{word.mnemonic}</div>
                  <div style={{ fontSize: 40, textAlign: 'center', padding: '1rem', background: '#f9f9f9', borderRadius: 8 }}>{word.scene_emoji}</div>
                  {word.syllables && (
                    <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                      {word.syllables.map((s, i) => (
                        <div key={i} style={{ flex: 1, padding: '10px 12px', border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
                          <div style={{ fontSize: 20, fontWeight: 700 }}>{s.zh}</div>
                          <div style={{ fontSize: 13, color: '#888', fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{s.pinyin}</div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: TONE_COLORS[s.tone - 1] }}>"{s.sound_hook}"</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {!flipped && (
                <div style={{ marginTop: '1.5rem', fontSize: 13, color: '#bbb', textAlign: 'center' }}>tap to reveal mnemonic</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              <button onClick={prev} style={{ flex: 1, height: 44, borderRadius: 10, border: '1px solid #ddd', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>←</button>
              <button onClick={saveWord} style={{
                flex: 2, height: 44, borderRadius: 10, border: '1px solid #ddd',
                background: isSaved ? '#f0faf5' : 'transparent',
                cursor: 'pointer', fontSize: 13,
                color: isSaved ? '#1D9E75' : '#666',
                fontFamily: 'Georgia, serif'
              }}>
                {isSaved ? 'Saved ✓' : 'Save word'}
              </button>
              <button onClick={next} style={{ flex: 1, height: 44, borderRadius: 10, border: '1px solid #ddd', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>→</button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 13, color: '#bbb' }}>{current + 1} / {words.length}</div>
          </>
        ) : null}
      </main>
    </div>
  )
}