'use client'
import { useRouter } from 'next/navigation'

export default function Pricing() {
  const router = useRouter()

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a', green: '#2c7a4b',
  }

  async function handleMonthly() {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ email: '' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  async function handleLifetime() {
    alert('Lifetime access coming soon!')
  }

  const features = [
    'All 300 HSK1 words',
    'Mnemonic stories for every word',
    'Custom illustrations',
    'Native audio pronunciation',
    'Flip card learning mode',
    'Multiple choice quiz mode',
    'Progress tracking',
    'All future HSK levels as they\'re added',
  ]

  const roadmap = [
    { level: 'HSK 1', words: '300 words', status: 'available' },
    { level: 'HSK 2', words: '200 words (500 total)', status: 'soon' },
    { level: 'HSK 3', words: '500 words (1,000 total)', status: 'soon' },
    { level: 'HSK 4', words: '1,000 words (2,000 total)', status: 'planned' },
    { level: 'HSK 5', words: '1,600 words (3,600 total)', status: 'planned' },
    { level: 'HSK 6', words: '1,800 words (5,400 total)', status: 'planned' },
  ]

  return (
    <div style={{ background: s.bg, minHeight: '100vh' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: `1px solid ${s.border}`, background: s.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <img src="/seal.svg" height="50" alt="Memorize Mandarin" style={{ cursor: 'pointer' }} onClick={() => router.push('/landing')} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/auth')} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${s.border}`, background: 'transparent', color: s.brown, fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Sign in</button>
          <button onClick={() => router.push('/demo')} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${s.border}`, background: 'transparent', color: s.brown, fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Try free</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: s.red, textTransform: 'uppercase', marginBottom: '1rem' }}>Pricing</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: s.text, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '1rem' }}>Simple, honest pricing</h1>
          <p style={{ fontSize: 16, color: s.muted, lineHeight: 1.7 }}>Start with a free trial. Upgrade when you're ready.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: '5rem' }}>

          {/* Monthly */}
          <div style={{ background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2rem' }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, textTransform: 'uppercase', marginBottom: '1rem' }}>Monthly</div>
            <div style={{ fontSize: 42, fontWeight: 700, color: s.text, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 4 }}>£1</div>
            <div style={{ fontSize: 14, color: s.muted, marginBottom: '2rem' }}>per month · cancel anytime · future levels included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: s.brown }}>
                  <span style={{ color: s.green, fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button onClick={handleMonthly} style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: s.red, color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
              Get monthly access →
            </button>
          </div>

          {/* Lifetime */}
          <div style={{ background: s.card, border: `2px solid ${s.red}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: s.red, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: 1 }}>BEST VALUE</div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: s.red, textTransform: 'uppercase', marginBottom: '1rem' }}>Lifetime</div>
            <div style={{ fontSize: 42, fontWeight: 700, color: s.text, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 4 }}>£20</div>
            <div style={{ fontSize: 14, color: s.muted, marginBottom: '2rem' }}>one-time payment · future levels included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: s.brown }}>
                  <span style={{ color: s.green, fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button onClick={handleLifetime} style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: s.red, color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
              Get lifetime access →
            </button>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-block', background: '#fdf0ee', border: `1px solid #e8c0b8`, borderRadius: 10, padding: '1rem 2rem', fontSize: 14, color: s.red }}>
            ✨ Not sure yet? <button onClick={() => router.push('/demo')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.red, fontWeight: 700, textDecoration: 'underline', fontSize: 14 }}>Try 20 words for free</button> - no account needed.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: s.red, textTransform: 'uppercase', marginBottom: '1rem' }}>Content roadmap</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '0.5rem' }}>What's included - and what's coming</h2>
          <p style={{ fontSize: 14, color: s.muted, marginBottom: '2.5rem' }}>Both plans include every level as it's released.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560, margin: '0 auto' }}>
          {roadmap.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, borderLeft: `3px solid ${item.status === 'available' ? s.green : s.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif' }}>{item.level}</span>
                <span style={{ fontSize: 13, color: s.muted }}>{item.words}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: item.status === 'available' ? s.green : item.status === 'soon' ? s.red : s.lightbrown }}>
                {item.status === 'available' ? '✓ Available now' : item.status === 'soon' ? 'Coming soon' : 'Planned'}
              </div>
            </div>
          ))}
        </div>

      </div>

      <footer style={{ background: s.card, borderTop: `1px solid ${s.border}`, padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>
        <img src="/seal.svg" height="60" alt="Memorize Mandarin" style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 12, color: s.lightbrown, marginBottom: 8 }}>Mandarin vocabulary with mnemonics · HSK1 available now</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => router.push('/contact')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.lightbrown, fontSize: 12, textDecoration: 'underline' }}>Contact us</button>
          <button onClick={() => router.push('/legal')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.lightbrown, fontSize: 12, textDecoration: 'underline' }}>Terms & Privacy</button>
        </div>
      </footer>

    </div>
  )
}