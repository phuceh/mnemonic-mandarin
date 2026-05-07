'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a'
  }

  async function handleSubmit() {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/app')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, color: s.red, letterSpacing: 4, marginBottom: 8 }}>普通话词汇助手</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif' }}>记 · Remember</h1>
      </div>

      <div style={{ width: '100%', maxWidth: 400, background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: s.text, fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>
          {isLogin ? 'Sign in' : 'Create account'}
        </h2>

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
          <label style={{ fontSize: 11, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${s.border}`, background: '#fff', fontSize: 15, fontFamily: 'Georgia, serif', color: s.text, outline: 'none', boxSizing: 'border-box' as const }}
          />
        </div>

        {message && (
          <div style={{ fontSize: 13, color: message.includes('Check') ? '#2c7a4b' : s.red, marginBottom: '1rem', padding: '10px 14px', background: message.includes('Check') ? '#f0faf5' : '#fdf0ee', borderRadius: 8 }}>
            {message}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: 8,
          background: s.red, border: 'none', color: '#fff',
          fontSize: 15, fontFamily: 'Georgia, serif',
          cursor: 'pointer', fontWeight: 700, marginBottom: '1rem'
        }}>
          {loading ? 'Loading...' : isLogin ? 'Sign in →' : 'Create account →'}
        </button>

        <button onClick={() => { setIsLogin(!isLogin); setMessage('') }} style={{
          width: '100%', padding: '10px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${s.border}`,
          color: s.muted, fontSize: 14, fontFamily: 'Georgia, serif', cursor: 'pointer'
        }}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
