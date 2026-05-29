'use client'
import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthForm() {
  const searchParams = useSearchParams()
  const subscribed = searchParams.get('subscribed') === 'true'
  const [isLogin, setIsLogin] = useState(!subscribed)
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

  async function handleForgotPassword() {
    if (!email) { setMessage('Please enter your email address first.'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a password reset link!')
    setLoading(false)
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

  async function handleSubscribe() {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <img src="/seal.svg" height="80" alt="Memorize Mandarin" style={{ display: 'block', margin: '0 auto 1.5rem' }} />

      {subscribed && !isLogin && (
        <div style={{ width: '100%', maxWidth: 400, background: '#f0faf5', border: '1px solid #2c7a4b', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#2c7a4b', fontFamily: 'Georgia, serif' }}>🎉 Payment confirmed! Create your account to get started.</div>
        </div>
      )}

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
        
        {isLogin && (
          <button onClick={handleForgotPassword} disabled={loading} style={{
            width: '100%', padding: '10px', borderRadius: 8,
            background: 'transparent', border: `1px solid ${s.border}`,
            color: s.muted, fontSize: 14, cursor: 'pointer', marginBottom: '1rem'
          }}>
            Forgot password?
          </button>
        )}

      </div>

      {isLogin && (
        <div style={{ marginTop: 16, fontSize: 13, color: s.muted, fontFamily: 'Georgia, serif', textAlign: 'center' }}>
          New here? <button onClick={handleSubscribe} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.red, fontSize: 13, fontFamily: 'Georgia, serif', textDecoration: 'underline' }}>Get full access for £1/month</button>
        </div>
      )}
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}