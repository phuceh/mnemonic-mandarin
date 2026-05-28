'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Word = {
  word_id: number
  chinese: string
  pinyin: string
  english: string
  mnemonic: string
}

export default function Demo() {
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) window.location.reload()
    })
  }, [])

  async function handleSubscribe() {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ email: '' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  const [words, setWords] = useState<Word[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a', green: '#2c7a4b'
  }

  useEffect(() => {
    supabase
      .from('vocabulary')
      .select('word_id, chinese, pinyin, english, mnemonic')
      .in('word_id', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
      .order('word_id')
      .then(({ data }) => {
        setWords(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', color: s.lightbrown }}>
      Loading...
    </div>
  )

  const word = words[current]
  const audioUrl = `https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/audio/${word?.word_id}.mp3`
  const imageUrl = `https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/images/${word?.word_id}.png`

  function next() {
    if (current + 1 >= words.length) {
      setFinished(true)
    } else {
      setFlipped(false)
      setTimeout(() => setCurrent(i => i + 1), 150)
    }
  }

  function prev() {
    if (current > 0) {
      setFlipped(false)
      setTimeout(() => setCurrent(i => i - 1), 150)
    }
  }

  function playAudio(e: React.MouseEvent) {
    e.stopPropagation()
    new Audio(audioUrl).play()
  }

  if (finished) return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Georgia, serif' }}>
      <img src="/seal.svg" height="80" alt="Memorize Mandarin" style={{ display: 'block', margin: '0 auto 1.5rem' }} />
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, marginBottom: 12 }}>You've learned 20 words!</h2>
        <p style={{ fontSize: 16, color: s.muted, lineHeight: 1.7, marginBottom: '2rem' }}>
          Get full access to all 300 HSK1 words, track your progress, and never forget a word again.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <button onClick={handleSubscribe} style={{ padding: '14px 32px', borderRadius: 10, border: 'none', background: s.red, color: '#fff', fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
            Get HSK1 full access: £1/month
          </button>
          <button onClick={() => { setCurrent(0); setFlipped(false); setFinished(false) }} style={{ padding: '14px 32px', borderRadius: 10, border: `1px solid ${s.border}`, background: s.card, color: s.brown, fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
            Learn again
          </button>
        </div>
        <button onClick={() => router.push('/landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.lightbrown, fontSize: 14, fontFamily: 'Georgia, serif' }}>← Back to home</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: s.bg, fontFamily: 'Georgia, serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: `1px solid ${s.border}`, background: s.card }}>
        <img src="/seal.svg" height="40" alt="Memorize Mandarin" />
        <button onClick={handleSubscribe} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: s.red, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>Get HSK1 full access: £1/month</button>
      </nav>

      <div style={{ maxWidth: 580, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 13, color: s.muted }}>Preview · {current + 1} of {words.length}</div>
          <div style={{ height: 6, flex: 1, margin: '0 1rem', background: s.border, borderRadius: 3 }}>
            <div style={{ height: '100%', background: s.red, borderRadius: 3, width: `${((current + 1) / words.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: 13, color: s.muted }}>{words.length - current - 1} left</div>
        </div>

        <div className="flip-card" onClick={() => setFlipped(!flipped)} style={{ marginBottom: '1rem', cursor: 'pointer', minHeight: 320 }}>
          <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>

            {/* Front */}
            <div className="flip-card-front" style={{ background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2.5rem 2rem', minHeight: 320, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, textTransform: 'uppercase', marginBottom: '1.5rem' }}>HSK 1</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 72, fontWeight: 700, color: s.text, lineHeight: 1, marginBottom: 12, fontFamily: 'serif' }}>{word.chinese}</div>
                <div style={{ fontSize: 22, color: s.muted, marginBottom: 6, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{word.pinyin}</div>
                <div style={{ fontSize: 16, color: s.lightbrown, letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>{word.english}</div>
                <button onClick={playAudio} style={{ padding: '7px 20px', borderRadius: 24, border: `1px solid ${s.border}`, background: '#fff', cursor: 'pointer', fontSize: 13, color: s.muted }}>🔊 Listen</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: '#c8a888', fontStyle: 'italic', marginTop: '2rem' }}>tap to reveal mnemonic</div>
            </div>

            {/* Back */}
            <div className="flip-card-back" style={{ background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2.5rem 2rem', minHeight: 320, boxShadow: '0 8px 32px rgba(192,57,43,0.08)' }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, textTransform: 'uppercase', marginBottom: '1.5rem' }}>HSK 1</div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: s.text, lineHeight: 1, marginBottom: 8, fontFamily: 'serif' }}>{word.chinese}</div>
                <div style={{ fontSize: 18, color: s.muted, marginBottom: 4, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{word.pinyin}</div>
                <div style={{ fontSize: 14, color: s.lightbrown, letterSpacing: 1, textTransform: 'uppercase' }}>{word.english}</div>
              </div>
              <div style={{ borderTop: `1px solid ${s.border}`, paddingTop: '1.25rem' }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, marginBottom: 10, textTransform: 'uppercase' }}>Mnemonic</div>
                <div style={{ fontSize: 15, lineHeight: 1.8, color: '#3d2010', marginBottom: '1.25rem' }}>{word.mnemonic}</div>
                <img src={imageUrl} alt={word.english} style={{ width: '100%', borderRadius: 8, objectFit: 'contain', maxHeight: 200, mixBlendMode: 'multiply' }} />
                <div style={{ textAlign: 'center', fontSize: 13, color: '#c8a888', fontStyle: 'italic', marginTop: '1.5rem' }}>tap to return</div>
              </div>
            </div>

          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          <button onClick={prev} disabled={current === 0} style={{ flex: 1, height: 48, borderRadius: 8, border: `1px solid ${s.border}`, background: s.card, cursor: current === 0 ? 'default' : 'pointer', fontSize: 20, color: current === 0 ? s.border : s.brown, opacity: current === 0 ? 0.4 : 1 }}>←</button>
          <button onClick={next} style={{ flex: 2, height: 48, borderRadius: 8, border: 'none', background: s.red, cursor: 'pointer', fontSize: 14, color: '#fff', fontWeight: 700 }}>
            {current + 1 >= words.length ? 'Finish →' : 'Next →'}
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf0ee', borderRadius: 8, border: `1px solid #e8c0b8` }}>
          <span style={{ fontSize: 13, color: s.red }}>✨ Enjoying this? </span>
          <button onClick={handleSubscribe} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.red, fontSize: 13, fontWeight: 700, fontFamily: 'Georgia, serif', textDecoration: 'underline' }}>Get full access for £1/month</button>
          <span style={{ fontSize: 13, color: s.red }}>: HSK1 full word list.</span>
        </div>
      </div>
    </div>
  )
}