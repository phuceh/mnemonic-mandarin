'use client'
import { useRouter } from 'next/navigation'

export default function Legal() {
  const router = useRouter()

  const s = {
    bg: '#f7f3ee', card: '#fffdf8', border: '#e8ddd0',
    red: '#c0392b', brown: '#5a3a2a', lightbrown: '#b08060',
    text: '#2d1810', muted: '#8b5a3a'
  }

  return (
    <div style={{ minHeight: '100vh', background: s.bg, padding: '2rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <button onClick={() => router.push('/landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, fontSize: 14, marginBottom: '2rem', display: 'block' }}>← Back to home</button>

        <img src="/seal.svg" height="60" alt="Memorize Mandarin" style={{ display: 'block', margin: '0 auto 2rem' }} />

        {/* TERMS OF SERVICE */}
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: s.muted, marginBottom: '2rem' }}>Last updated: May 2026</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>1. About Memorize Mandarin</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>Memorize Mandarin is operated by Three Infinity, based in the United Kingdom. By using our service you agree to these terms.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>2. Subscription</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>Memorize Mandarin is a paid subscription service currently priced at £1 per month. Your subscription renews automatically each month until cancelled. You can cancel at any time through the "My Subscription" button in the app, which will take you to our payment provider Stripe's customer portal. Cancellation takes effect at the end of your current billing period.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>3. Refunds</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>We offer a full refund within 14 days of your first payment if you are not satisfied. To request a refund, contact us at threeinfinity575@gmail.com. Refunds are not available for subsequent billing periods after the first 14 days.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>4. Content</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>Currently HSK1 vocabulary (300 words) is available. HSK2 and above are in development and will be added in future updates. We reserve the right to add, modify or remove content at any time.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>5. Account</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>You are responsible for keeping your account credentials secure. You must not share your account with others. We reserve the right to suspend or terminate accounts that violate these terms.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>6. Limitation of Liability</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>Memorize Mandarin is provided "as is". We make no guarantees about the accuracy of content or uninterrupted availability of the service. Our liability is limited to the amount you have paid in the current billing month.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>7. Governing Law</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>These terms are governed by the laws of England and Wales.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>8. Contact</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8 }}>For any questions about these terms, contact us at threeinfinity575@gmail.com.</p>
        </div>

        {/* PRIVACY POLICY */}
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.red}`, borderRadius: 12, padding: '2.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: s.muted, marginBottom: '2rem' }}>Last updated: May 2026</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>1. Who we are</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>Three Infinity operates Memorize Mandarin. We are the data controller for your personal data. You can contact us at threeinfinity575@gmail.com.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>2. What data we collect</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>We collect the following data when you use Memorize Mandarin:</p>
          <ul style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: 8 }}><strong>Email address</strong> — used to create your account and manage your subscription</li>
            <li style={{ marginBottom: 8 }}><strong>Payment information</strong> — processed securely by Stripe. We do not store card details.</li>
            <li style={{ marginBottom: 8 }}><strong>Learning progress</strong> — which words you have marked as learned</li>
            <li style={{ marginBottom: 8 }}><strong>Usage data</strong> — basic analytics about how you use the app</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>3. How we use your data</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>We use your data to provide and improve the service, manage your subscription, and respond to support requests. We do not sell your data to third parties or use it for advertising.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>4. Third parties</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>We use the following third party services:</p>
          <ul style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: 8 }}><strong>Supabase</strong> — database and authentication (EU hosted)</li>
            <li style={{ marginBottom: 8 }}><strong>Stripe</strong> — payment processing</li>
            <li style={{ marginBottom: 8 }}><strong>Vercel</strong> — hosting</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>5. Your rights</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>Under UK GDPR you have the right to access, correct or delete your personal data. To exercise these rights contact us at threeinfinity575@gmail.com. You also have the right to lodge a complaint with the ICO (ico.org.uk).</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>6. Data retention</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>We retain your data for as long as your account is active. If you cancel your subscription and request account deletion we will delete your data within 30 days.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>7. Cookies</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8, marginBottom: '1rem' }}>We use essential cookies only for authentication. We do not use tracking or advertising cookies.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: s.text, marginBottom: 8, marginTop: '1.5rem' }}>8. Contact</h2>
          <p style={{ fontSize: 15, color: s.muted, lineHeight: 1.8 }}>For any privacy queries contact us at threeinfinity575@gmail.com.</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button onClick={() => router.push('/landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, fontSize: 14 }}>← Back to home</button>
        </div>
      </div>
    </div>
  )
}