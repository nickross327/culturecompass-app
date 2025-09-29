// src/pages/Home.jsx
import React from 'react'

export default function Home() {
  return (
    <main style={styles.wrap}>
      <header style={styles.header}>
        <img
          src="/favicon.svg"
          alt="CultureCompass"
          style={{ width: 56, height: 56, marginRight: 12 }}
        />
        <h1 style={styles.title}>CultureCompass</h1>
      </header>

      <p style={styles.tagline}>
        Master 90+ cultures with AI-powered etiquette, language tips, and on-the-go checklists.
      </p>

      <div style={styles.ctaRow}>
        <a href="https://app.culturecompass.app" style={styles.primaryBtn}>
          Open the app
        </a>
        <a href="mailto:info@culturecompass.app" style={styles.secondaryBtn}>
          Contact us
        </a>
      </div>

      <section style={styles.features}>
        <Feature title="Country Guides" desc="Dos & don'ts, business etiquette, dining, gifts, gestures, more." />
        <Feature title="AI Planner" desc="Ask anything—get quick, practical, culture-safe answers." />
        <Feature title="Badges" desc="Track progress and save key notes for trips & meetings." />
        <Feature title="Offline Cache" desc="Keep essentials handy even without a connection." />
      </section>

      <footer style={styles.footer}>
        <a href="/terms.html" style={styles.link}>Terms</a>
        <span style={styles.dot}>•</span>
        <a href="/privacy.html" style={styles.link}>Privacy</a>
        <span style={styles.dot}>•</span>
        <a href="mailto:privacy@culturecompass.app" style={styles.link}>privacy@culturecompass.app</a>
      </footer>
    </main>
  )
}

function Feature({ title, desc }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDesc}>{desc}</p>
    </div>
  )
}

const styles = {
  wrap: { maxWidth: 980, margin: '0 auto', padding: '48px 24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif', color: '#0f172a' },
  header: { display: 'flex', alignItems: 'center', marginBottom: 12 },
  title: { margin: 0, fontSize: 32, letterSpacing: -0.2 },
  tagline: { marginTop: 4, color: '#334155' },
  ctaRow: { display: 'flex', gap: 12, marginTop: 20, marginBottom: 28, flexWrap: 'wrap' },
  primaryBtn: {
    background: '#0ea5e9', color: 'white', padding: '12px 18px', borderRadius: 10,
    textDecoration: 'none', fontWeight: 600
  },
  secondaryBtn: {
    background: '#e2e8f0', color: '#0f172a', padding: '12px 18px', borderRadius: 10,
    textDecoration: 'none', fontWeight: 600
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 14, marginTop: 8
  },
  card: { border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, background: 'white' },
  cardTitle: { margin: '0 0 6px', fontSize: 18 },
  cardDesc: { margin: 0, color: '#475569', lineHeight: 1.5 },
  footer: { marginTop: 36, color: '#64748b', fontSize: 14 },
  link: { color: '#0ea5e9', textDecoration: 'none' },
  dot: { margin: '0 8px' }
}
