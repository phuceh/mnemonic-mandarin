'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a'
  }

  async function handleReset() {
    if (!password) { setMessage('Please enter a new password.'); return }
    if (password.length < 6) { setMessage('Password must be at least 6 characters.'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else {
      setMessage('Password updated! Redirecting...')
      setTimeout(() => router.push('/app'), 2000)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <img src="/seal.svg" height="80" alt="Memorize Mandarin" style={{ display: 'block', margin: '0 auto 1.5rem' }} />
      <div style={{ width: '100%', maxWidth: 400, background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: s.text, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 4 }}>Reset password</h2>
        <p style={{ fontSize: 14, color: s.muted, marginBottom: '1.5rem' }}>Enter your new password below.</p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: 11, letterSpacing: 2, color: s.lightbrown, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>New password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleReset()}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${s.border}`, background: '#fff', fontSize: 15, color: s.text, outline: 'none', boxSizing: 'border-box' as const }}
          />
        </div>

        {message && (
          <div style={{ fontSize: 13, color: message.includes('updated') ? '#2c7a4b' : s.red, marginBottom: '1rem', padding: '10px 14px', background: message.includes('updated') ? '#f0faf5' : '#fdf0ee', borderRadius: 8 }}>
            {message}
          </div>
        )}

        <button onClick={handleReset} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 8, background: s.red, border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontWeight: 700 }}>
          {loading ? 'Updating...' : 'Update password →'}
        </button>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}