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
}

const TONE_COLORS = ['#378ADD', '#1D9E75', '#D85A30', '#D4537E']

export default function Home() {
  const [words, setWords] = useState<Word[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [saved, setSaved] = useState<Word[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWords()
  }, [filter])

  async function fetchWords() {
    setLoading(true)
    let query = supabase.from('vocabulary').select('*')
    if (filter !== 'all') query = query.eq('topic', filter)
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
    if (!saved.find(w => w.id === words[current].id)) {
      setSaved([...saved, words[current]])
    }
  }

  const word = words[current]
  const topics = ['all', 'greetings', 'work', 'food', 'people']

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: 600, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>记 · Remember</h1>
        <p style={{ color: '#888', fontSize: 14, letterSpacing: 3 }}>普通话词汇助手</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {topics.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '6px 14px', borderRadius: 20, border: '1px solid',
            borderColor: filter === t ? '#333' : '#ddd',
            background: filter === t ? '#333' : 'transparent',
            color: filter === t ? '#fff' : '#666',
            cursor: 'pointer', fontSize: 13
          }}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading...</div>
      ) : word ? (
        <>
          <div onClick={() => setFlipped(!flipped)} style={{
            background: '#fff', border: '1px solid #eee', borderRadius: 16,
            padding: '2rem', marginBottom: '1rem', cursor: 'pointer',
            minHeight: 280, transition: 'box-shadow 0.2s',
            boxShadow: flipped ? '0 4px 24px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{word.chinese}</div>
                <div style={{ fontSize: 20, color: '#555', marginBottom: 4, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{word.pinyin}</div>
                <div style={{ fontSize: 14, color: '#999' }}>{word.english}</div>
              </div>
              <div style={{ fontSize: 11, color: '#bbb', letterSpacing: 1 }}>HSK {word.hsk_level}</div>
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
            <button onClick={saveWord} style={{ flex: 2, height: 44, borderRadius: 10, border: '1px solid #ddd', background: 'transparent', cursor: 'pointer', fontSize: 13, color: saved.find(w => w.id === word.id) ? '#1D9E75' : '#666' }}>
              {saved.find(w => w.id === word.id) ? 'Saved ✓' : 'Save word'}
            </button>
            <button onClick={next} style={{ flex: 1, height: 44, borderRadius: 10, border: '1px solid #ddd', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>→</button>
          </div>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#bbb' }}>{current + 1} / {words.length}</div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>No words found for this topic.</div>
      )}

      {saved.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#bbb', marginBottom: 10, textTransform: 'uppercase' }}>Saved words</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {saved.map(w => (
              <span key={w.id} style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid #eee', fontSize: 16 }}>{w.chinese}</span>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
