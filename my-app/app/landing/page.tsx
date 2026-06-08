'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Landing() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) window.location.reload()
    })
  }, [])

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a',
  }

  const features = [
    { emoji: '🧠', title: 'Mnemonic stories', desc: 'Every word comes with a vivid, absurd story that phonetically encodes the sound. Your brain remembers stories, not lists.' },
    { emoji: '🔊', title: 'Native pronunciation', desc: 'Hear every word spoken clearly in Mandarin. Tones are colour-coded so you always know how to say it correctly.' },
    { emoji: '📖', title: 'Flashcard learning', desc: 'Browse words by HSK level at your own pace. Tap to reveal the mnemonic and save words you want to revisit.' },
    { emoji: '🧪', title: 'Quiz yourself', desc: 'Test your knowledge with multiple choice quizzes. Track your score and streak as you go.' },
    { emoji: '📈', title: 'Track progress', desc: 'Mark words as learned and watch your progress bars fill up across each HSK level.' },
    { emoji: '🎯', title: 'HSK aligned', desc: 'Content follows the HSK standard, the international benchmark for Mandarin proficiency. HSK1-2 is available now, with more levels coming soon.' },
  ]

  const examples = [
    { chinese: '你好', pinyin: 'nǐ hǎo', english: 'hello', mnemonic: 'You knock your KNEE on a table and say HOW embarrassing - that\'s how you say HELLO.', image: 'https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/images/147.png', audio: 'https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/audio/147.mp3'},
    { chinese: '包子', pinyin: 'bāo zi', english: 'steamed stuffed bun', mnemonic: 'She BOWS and is handed a large STEAMED STUFFED BUN.', image: 'https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/images/8.png', audio: 'https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/audio/8.mp3'},
    { chinese: '做饭', pinyin: 'zuò fàn', english: 'to cook', mnemonic: 'A chef uses a SAW on a spinning FAN to chop vegetables, because he\'s trying to COOK.', image: 'https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/images/300.png', audio: 'https://tfgdctbuhsoflecjymvw.supabase.co/storage/v1/object/public/audio/300.mp3'},
  ]

  return (
    <div style={{ background: s.bg, minHeight: '100vh' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #e8ddd0', background: s.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <img src="/seal.svg" height="50" alt="Memorize Mandarin" />
        <div style={{ display: 'flex', gap: 10 }}>
          {!isMobile && <button onClick={() => router.push('/auth')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e8ddd0', background: 'transparent', color: s.brown, fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Sign in</button>}
          {!isMobile && <button onClick={() => router.push('/demo')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e8ddd0', background: 'transparent', color: s.brown, fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Try free</button>}
          <button onClick={() => router.push('/pricing')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: s.red, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>Get full access</button>
        </div>
      </nav>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2rem 4rem', textAlign: 'center' }}>
        <img src="/logo.svg" height="180" alt="Memorize Mandarin" style={{ display: 'block', margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: 52, fontWeight: 700, color: s.text, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.25rem', fontFamily: '"Playfair Display", Georgia, serif' }}>
          Remember Mandarin<br />
          <span style={{ color: s.red }}>words that actually stick</span>
        </h1>
        <p style={{ fontSize: 18, color: s.muted, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Most vocabulary apps rely on repetition. Memorize Mandarin uses mnemonic stories - vivid, absurd scenes that make words unforgettable from the first read.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/demo')} style={{ padding: '14px 32px', borderRadius: 10, border: '1px solid #e8ddd0', background: s.card, color: s.brown, fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Try for free</button>
          <button onClick={() => router.push('/pricing')} style={{ padding: '14px 32px', borderRadius: 10, border: 'none', background: s.red, color: '#fff', fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>Get full access</button>
        </div>
        <div style={{ fontSize: 14, color: s.muted, marginTop: 12 }}>HSK1-2 available now · HSK3+ coming soon · Cancel subscription anytime · Lifetime access available</div>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2rem 5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: s.red, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>See it in action</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, textAlign: 'center', marginBottom: '2.5rem', fontFamily: '"Playfair Display", Georgia, serif' }}>Every word has a story</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {examples.map((ex, i) => (
            <div key={i} style={{ background: s.card, border: '1px solid #e8ddd0', borderTop: '3px solid #c0392b', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: s.text, fontFamily: 'serif', lineHeight: 1, marginBottom: 6 }}>{ex.chinese}</div>
                <div style={{ fontSize: 16, color: s.muted, marginBottom: 4, fontFamily: 'Calibri, "Trebuchet MS", "Arial Unicode MS", sans-serif' }}>{ex.pinyin}</div>
                <div style={{ fontSize: 13, color: s.lightbrown, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{ex.english}</div>
                {ex.audio && (
                  <button onClick={() => new Audio(ex.audio).play()} style={{ padding: '5px 16px', borderRadius: 20, border: '1px solid #e8ddd0', background: '#fff', cursor: 'pointer', fontSize: 12, color: s.muted, fontFamily: 'Georgia, serif' }}>🔊 Listen</button>
                )}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e8ddd0', margin: '1rem 0' }} />
              <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, marginBottom: 6, textTransform: 'uppercase' }}>Mnemonic</div>
              <div style={{ fontSize: 14, color: s.text, lineHeight: 1.7, marginBottom: 12 }}>{ex.mnemonic}</div>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                {ex.image && <img src={ex.image} alt={ex.english} style={{ width: '100%', borderRadius: 8, objectFit: 'contain', maxHeight: 160, mixBlendMode: 'multiply' }} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: s.card, borderTop: '1px solid #e8ddd0', borderBottom: '1px solid #e8ddd0', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: s.red, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>Everything you need</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, textAlign: 'center', marginBottom: '3rem', fontFamily: '"Playfair Display", Georgia, serif' }}>Built for real learning</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid #e8ddd0', background: s.bg }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.text, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: s.muted, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: s.red, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>The method</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, textAlign: 'center', marginBottom: '3rem', fontFamily: '"Playfair Display", Georgia, serif' }}>Why mnemonics work</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { num: '01', title: 'Hear the sound', desc: 'Each Mandarin syllable is mapped to a familiar English sound hook - something you already know.' },
            { num: '02', title: 'Picture the scene', desc: 'The sound hook becomes part of a vivid, absurd story. The stranger the scene, the better your brain remembers it.' },
            { num: '03', title: 'Lock it in', desc: 'Quiz yourself to reinforce the memory. Mark words as learned and track your progress across HSK levels.' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, padding: '1.5rem', background: s.card, border: '1px solid #e8ddd0', borderRadius: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.red, minWidth: 40 }}>{step.num}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.text, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: s.muted, lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: s.red, padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 4, marginBottom: 12 }}>记 · REMEMBER</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: '"Playfair Display", Georgia, serif' }}>Start remembering Mandarin today</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}></p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/demo')} style={{ padding: '14px 36px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
            Try for free
          </button>
          <button onClick={() => router.push('/pricing')} style={{ padding: '14px 36px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.4)', background: '#fff', color: s.red, fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
            Get full access
          </button>
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>HSK1-2 available now · HSK3+ coming soon · Cancel subscription anytime · Lifetime access available</div>
      </section>

      <footer style={{ background: s.card, borderTop: '1px solid #e8ddd0', padding: '2rem', textAlign: 'center' }}>
        <img src="/seal.svg" height="60" alt="Memorize Mandarin" style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 12, color: s.lightbrown, marginBottom: 8 }}>Mandarin vocabulary with mnemonics · HSK1-2 available now</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => router.push('/contact')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.lightbrown, fontSize: 12, textDecoration: 'underline' }}>Contact us</button>
          <button onClick={() => router.push('/legal')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.lightbrown, fontSize: 12, textDecoration: 'underline' }}>Terms & Privacy</button>
        </div>
      </footer>
    </div>
  )
}