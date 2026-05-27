'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a', green: '#2c7a4b'
  }

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { setStatus('error'); return }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setStatus('success')
        setTimeout(() => router.push('/app'), 2000)
      } else {
        setStatus('success')
        setTimeout(() => router.push('/auth?subscribed=true'), 2000)
      }
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Georgia, serif' }}>
      <img src="/seal.svg" height="80" alt="Memorize Mandarin" style={{ display: 'block', margin: '0 auto 1.5rem' }} />
      {status === 'loading' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: s.muted }}>Processing your subscription...</div>
        </div>
      )}
      {status === 'success' && (
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, marginBottom: 12 }}>Welcome to Memorize Mandarin!</h2>
          <p style={{ fontSize: 16, color: s.muted, lineHeight: 1.7, marginBottom: '2rem' }}>
            Your subscription is confirmed. Redirecting you now...
          </p>
        </div>
      )}
      {status === 'error' && (
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: s.text, marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ fontSize: 16, color: s.muted, marginBottom: '2rem' }}>Please contact support if you were charged.</p>
          <button onClick={() => router.push('/landing')} style={{ padding: '12px 24px', borderRadius: 8, border: 'none', background: s.red, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Back to home</button>
        </div>
      )}
    </div>
  )
}

export default function Success() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}