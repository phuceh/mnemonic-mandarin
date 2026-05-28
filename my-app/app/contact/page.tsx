'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import emailjs from '@emailjs/browser'
import { supabase } from '@/lib/supabase'

export default function Contact() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user)
    })
  }, [])

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a', green: '#2c7a4b'
  }

  async function handleSubmit() {
    if (!name || !email || !message) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { from_name: name, from_email: email, message, email },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setSent(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Georgia, serif' }}>
      <img src="/seal.svg" height="80" alt="Memorize Mandarin" style={{ display: 'block', margin: '0 auto 1.5rem', cursor: 'pointer' }} onClick={() => router.push(isLoggedIn ? '/app' : '/landing')} />

      <div style={{ width: '100%', maxWidth: 480, background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2rem' }}>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: s.text, marginBottom: 12 }}>Message sent!</h2>
            <p style={{ fontSize: 15, color: s.muted, marginBottom: '1.5rem' }}>Thanks for getting in touch. We'll get back to you as soon as possible.</p>
            <button onClick={() => router.push(isLoggedIn ? '/app' : '/landing')} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: s.red, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>{isLoggedIn ? '← Back to app' : '← Back to home'}</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: s.text, marginBottom: 4 }}>Contact us</h2>
            <p style={{ fontSize: 14, color: s.muted, marginBottom: '1.5rem' }}>Questions, feedback or issues - we'd love to hear from you.</p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 11, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${s.border}`, background: '#fff', fontSize: 15, fontFamily: 'Georgia, serif', color: s.text, outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 11, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${s.border}`, background: '#fff', fontSize: 15, fontFamily: 'Georgia, serif', color: s.text, outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: 11, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${s.border}`, background: '#fff', fontSize: 15, fontFamily: 'Georgia, serif', color: s.text, outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const }}
              />
            </div>

            {error && (
              <div style={{ fontSize: 13, color: s.red, marginBottom: '1rem', padding: '10px 14px', background: '#fdf0ee', borderRadius: 8 }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 8, background: s.red, border: 'none', color: '#fff', fontSize: 15, fontFamily: 'Georgia, serif', cursor: 'pointer', fontWeight: 700, marginBottom: '1rem' }}>
              {loading ? 'Sending...' : 'Send message →'}
            </button>

            <button onClick={() => router.push(isLoggedIn ? '/app' : '/landing')} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'transparent', border: `1px solid ${s.border}`, color: s.muted, fontSize: 14, fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              {isLoggedIn ? '← Back to app' : '← Back to home'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}