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

const TONE_COLORS = ['#c0392b', '#8e6a3a', '#2c7a4b', '#1a5a8a']

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
    if (!saved.find(w => w.id === word.id)) setSaved([...saved, word])
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

  const menuBtn: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 6, border: '1px solid',
    cursor: 'pointer', fontSize: 14, textAlign: 'left' as const,
    fontFamily: 'Georgia, serif', width: '100%', marginBottom: 4,
    transition: 'all 0.15s',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f3ee' }}>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 10
        }} />
      )}

      {/* Side menu */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: 256,
        background: '#fdf8f2', borderRight: '1px solid #e8ddd0', zIndex: 20,
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease', padding: '2rem 1.5rem',
        display: 'flex', flexDirection: 'column', overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#2d1810', fontFamily: 'Georgia, serif' }}>记 · Remember</div>
          <div style={{ fontSize: 11, color: '#c0392b', letterSpacing: 3, marginTop: 2 }}>普通话词汇助手</div>
        </div>

        <div style={{ fontSize: 10, letterSpacing: 2, color: '#b08060', marginBottom: 10, textTransform: 'uppercase' }}>HSK Level</div>
        {(['all', 1, 2, 3, 4, 5, 6] as any[]).map(level => (
          <button key={level} onClick={() => { setHskLevel(level); setMenuOpen(false) }} style={{
            ...menuBtn,
            borderColor: hskLevel === level ? '#c0392b' : '#e8ddd0',
            background: hskLevel === level ? '#c0392b' : 'transparent',
            color: hskLevel === level ? '#fff' : '#5a3a2a',
          }}>
            {level === 'all' ? 'All words' : `HSK ${level}`}
          </button>
        ))}

        <div style={{ fontSize: 10, letterSpacing: 2, color: '#b08060', margin: '1.5rem 0 10px', textTransform: 'uppercase' }}>My Words</div>
        <button onClick={() => { setHskLevel('saved'); setMenuOpen(false) }} style={{
          ...menuBtn,
          borderColor: hskLevel === 'saved' ? '#c0392b' : '#e8ddd0',
          background: hskLevel === 'saved' ? '#c0392b' : 'transparent',
          color: hskLevel === 'saved' ? '#fff' : '#5a3a2a',
        }}>
          Saved words {saved.length > 0 && `(${saved.length})`}
        </button>

        {hskLevel === 'saved' && saved.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {saved.map(w => (
              <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid #e8ddd0' }}>
                <span style={{ fontSize: 20, color: '#2d1810' }}>{w.chinese}</span>
                <span style={{ fontSize: 12, color: '#b08060', flex: 1, marginLeft: 8 }}>{w.english}</span>
                <button onClick={() => removeWord(w.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: 16 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 580, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
          <button onClick={() => setMenuOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: '#5a3a2a', padding: '4px 8px 4px 0'
          }}>☰</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2d1810', fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>记 · Remember</h1>
            <div style={{ fontSize: 11, color: '#c0392b', letterSpacing: 4, marginTop: 2 }}>普通话词汇助手</div>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#b08060' }}>Loading...</div>
        ) : words.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#b08060' }}>
            {hskLevel === 'saved' ? 'No saved words yet.' : 'No words found.'}
          </div>
        ) : word ? (
          <>
            {/* Card */}
            <div onClick={() => setFlipped(!flipped)} style={{
              background: '#fffdf8',
              border: '1px solid #e8ddd0',
              borderTop: '3px solid #c0392b',
              borderRadius: 12,
              padding: '2.5rem 2rem',
              marginBottom: '1rem',
              cursor: 'pointer',
              minHeight: 320,
              transition: 'box-shadow 0.2s',
              boxShadow: flipped ? '0 8px 32px rgba(192,57,43,0.08)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {/* Top tag row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: '#c0392b', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
                  HSK {word.hsk_level}
                </div>
                <div style={{
                  fontSize: 10, letterSpacing: 1, color: '#b08060',
                  textTransform: 'uppercase', background: '#f5ede4',
                  padding: '3px 10px', borderRadius: 4
                }}>
                  {word.topic}
                </div>
              </div>

              {/* Word */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 72, fontWeight: 700, color: '#2d1810', lineHeight: 1, marginBottom: 12, fontFamily: 'serif' }}>{word.chinese}</div>
                <div style={{ fontSize: 22, color: '#8b5a3a', marginBottom: 6, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{word.pinyin}</div>
                <div style={{ fontSize: 16, color: '#b08060', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>{word.english}</div>
                {word.audio_url && (
                  <button onClick={(e) => playAudio(word.audio_url, e)} style={{
                    padding: '7px 20px', borderRadius: 24,
                    border: '1px solid #e8ddd0', background: '#fff',
                    cursor: 'pointer', fontSize: 13, color: '#8b5a3a',
                    fontFamily: 'Georgia, serif'
                  }}>🔊 Listen</button>
                )}
              </div>

              {/* Mnemonic */}
              {flipped ? (
                <>
                  <div style={{ borderTop: '1px solid #e8ddd0', paddingTop: '1.5rem' }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: '#c0392b', marginBottom: 10, textTransform: 'uppercase' }}>Mnemonic</div>
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#3d2010', marginBottom: '1.25rem' }}>{word.mnemonic}</div>
                    <div style={{ fontSize: 44, textAlign: 'center', padding: '1.25rem', background: '#f5ede4', borderRadius: 8 }}>{word.scene_emoji}</div>
                    {word.syllables && word.syllables.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                        {word.syllables.map((s, i) => (
                          <div key={i} style={{ flex: 1, padding: '10px 12px', border: '1px solid #e8ddd0', borderRadius: 8, textAlign: 'center', background: '#fff' }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#2d1810', fontFamily: 'serif' }}>{s.zh}</div>
                            <div style={{ fontSize: 13, color: '#8b5a3a', fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{s.pinyin}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: TONE_COLORS[s.tone - 1] }}>"{s.sound_hook}"</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', fontSize: 13, color: '#c8a888', fontStyle: 'italic', marginTop: '1rem' }}>
                  tap to reveal mnemonic
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              <button onClick={prev} style={{
                flex: 1, height: 48, borderRadius: 8,
                border: '1px solid #e8ddd0', background: '#fffdf8',
                cursor: 'pointer', fontSize: 20, color: '#5a3a2a'
              }}>←</button>
              <button onClick={saveWord} style={{
                flex: 2, height: 48, borderRadius: 8,
                border: `1px solid ${isSaved ? '#c0392b' : '#e8ddd0'}`,
                background: isSaved ? '#fdf0ee' : '#fffdf8',
                cursor: 'pointer', fontSize: 13,
                color: isSaved ? '#c0392b' : '#5a3a2a',
                fontFamily: 'Georgia, serif'
              }}>
                {isSaved ? 'Saved ✓' : 'Save word'}
              </button>
              <button onClick={next} style={{
                flex: 1, height: 48, borderRadius: 8,
                border: '1px solid #e8ddd0', background: '#fffdf8',
                cursor: 'pointer', fontSize: 20, color: '#5a3a2a'
              }}>→</button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 12, color: '#c8a888', letterSpacing: 1 }}>
              {current + 1} / {words.length}
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}