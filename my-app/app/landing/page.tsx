'use client'
import { useRouter } from 'next/navigation'

export default function Landing() {
  const router = useRouter()

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
    { emoji: '🎯', title: 'HSK aligned', desc: 'Content is organised by HSK levels 1-6, the international standard for Mandarin proficiency.' },
  ]

  const examples = [
    { chinese: '老板', pinyin: 'lao ban', english: 'Boss', mnemonic: 'You hear a LOUD BANG and your boss dramatically appears in a cloud of smoke!', emoji: '💥' },
    { chinese: '你好', pinyin: 'ni hao', english: 'Hello', mnemonic: 'You knock your KNEE on a table and say HOW embarrassing - that is how you greet everyone!', emoji: '🦵' },
    { chinese: '谢谢', pinyin: 'xie xie', english: 'Thank you', mnemonic: 'You SHAY SHAY your hips in a thank you dance!', emoji: '🕺' },
  ]

  return (
    <div style={{ background: s.bg, minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #e8ddd0', background: s.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.text }}>Memorize Mandarin</div>
          <div style={{ fontSize: 10, color: s.red, letterSpacing: 3 }}>记 · Remember</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/auth')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e8ddd0', background: 'transparent', color: s.brown, fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Sign in</button>
          <button onClick={() => router.push('/')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: s.red, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>Try free</button>
        </div>
      </nav>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#fdf0ee', border: '1px solid #e8c0b8', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: s.red, letterSpacing: 2, marginBottom: '1.5rem' }}>
          HSK 1-6 · 150+ words · Free to use
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, color: s.text, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.25rem' }}>
          Remember Mandarin<br />
          <span style={{ color: s.red }}>words that actually stick</span>
        </h1>
        <p style={{ fontSize: 18, color: s.muted, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Most vocabulary apps rely on repetition. Memorize Mandarin uses mnemonic stories — vivid, absurd scenes that make words unforgettable from the first read.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/')} style={{ padding: '14px 32px', borderRadius: 10, border: 'none', background: s.red, color: '#fff', fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>Start learning free</button>
          <button onClick={() => router.push('/auth')} style={{ padding: '14px 32px', borderRadius: 10, border: '1px solid #e8ddd0', background: s.card, color: s.brown, fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Create account</button>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2rem 5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: s.red, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>See it in action</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, textAlign: 'center', marginBottom: '2.5rem' }}>Every word has a story</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {examples.map((ex, i) => (
            <div key={i} style={{ background: s.card, border: '1px solid #e8ddd0', borderTop: '3px solid #c0392b', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: s.text, fontFamily: 'serif', lineHeight: 1, marginBottom: 6 }}>{ex.chinese}</div>
                <div style={{ fontSize: 16, color: s.muted, marginBottom: 2 }}>{ex.pinyin}</div>
                <div style={{ fontSize: 13, color: s.lightbrown, letterSpacing: 1, textTransform: 'uppercase' }}>{ex.english}</div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e8ddd0', margin: '1rem 0' }} />
              <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, marginBottom: 6, textTransform: 'uppercase' }}>Mnemonic</div>
              <div style={{ fontSize: 14, color: s.text, lineHeight: 1.7, marginBottom: 12 }}>{ex.mnemonic}</div>
              <div style={{ fontSize: 32, textAlign: 'center', padding: '0.75rem', background: '#f5ede4', borderRadius: 8 }}>{ex.emoji}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: s.card, borderTop: '1px solid #e8ddd0', borderBottom: '1px solid #e8ddd0', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: s.red, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>Everything you need</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, textAlign: 'center', marginBottom: '3rem' }}>Built for real learning</h2>
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
        <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, textAlign: 'center', marginBottom: '3rem' }}>Why mnemonics work</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { num: '01', title: 'Hear the sound', desc: 'Each Mandarin syllable is mapped to a familiar English sound hook — something you already know.' },
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
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Start remembering Mandarin today</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}>Free to use. No credit card required.</p>
        <button onClick={() => router.push('/')} style={{ padding: '14px 36px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.4)', background: '#fff', color: s.red, fontSize: 16, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
          Start learning free
        </button>
      </section>

      <footer style={{ background: s.card, borderTop: '1px solid #e8ddd0', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: s.text, marginBottom: 4 }}>Memorize Mandarin</div>
        <div style={{ fontSize: 11, color: s.red, letterSpacing: 3, marginBottom: 12 }}>记 · Remember</div>
        <div style={{ fontSize: 12, color: s.lightbrown }}>Mandarin vocabulary with mnemonics · HSK 1-6</div>
      </footer>
    </div>
  )
}