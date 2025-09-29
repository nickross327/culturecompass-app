import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main style={styles.wrap}>
      <header style={styles.header}>
        <img src="/favicon.svg" alt="CultureCompass" style={styles.logo}/>
        <div>
          <h1 style={styles.title}>CultureCompass</h1>
          <p style={styles.tagline}>AI-powered cultural intuition for travel, work, and life.</p>
        </div>
      </header>

      <nav style={styles.nav}>
        <Link to="/country/jp" style={styles.btn}>Explore Japan</Link>
        <Link to="/country/fr" style={styles.btn}>Explore France</Link>
        <Link to="/country/us" style={styles.btn}>Explore USA</Link>
      </nav>

      <section style={styles.grid}>
        <Card title="Country Guides" desc="Dos & don'ts, business etiquette, dining, gifts, gestures."/>
        <Card title="AI Planner"    desc="Ask culture questions and get instant, safe advice."/>
        <Card title="Badges"        desc="Track your progress and save notes."/>
        <Card title="Offline Cache" desc="Keep essentials handy even without a connection."/>
      </section>

      <footer style={styles.footer}>
        <a href="/terms" style={styles.link}>Terms</a>
        <span> · </span>
        <a href="/privacy" style={styles.link}>Privacy</a>
        <span> · </span>
        <a href="mailto:info@culturecompass.app" style={styles.link}>info@culturecompass.app</a>
      </footer>
    </main>
  )
}

function Card({ title, desc }) {
  return (
    <div style={styles.card}>
      <h3 style={{margin:'0 0 6px'}}>{title}</h3>
      <p style={{margin:0, color:'#475569'}}>{desc}</p>
    </div>
  )
}

const styles = {
  wrap: {maxWidth:980, margin:'0 auto', padding:'48px 24px', fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif', color:'#0f172a'},
  header: {display:'flex', alignItems:'center', gap:16, marginBottom:14},
  logo: {width:48, height:48},
  title: {margin:0, fontSize:32, letterSpacing:-0.2},
  tagline: {margin:'6px 0 0', color:'#334155'},
  nav: {display:'flex', gap:12, flexWrap:'wrap', margin:'18px 0 26px'},
  btn: {background:'#0ea5e9', color:'#fff', padding:'10px 14px', borderRadius:10, textDecoration:'none', fontWeight:600},
  grid: {display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:14},
  card: {border:'1px solid #e2e8f0', borderRadius:12, padding:16, background:'#fff'},
  footer: {marginTop:36, color:'#64748b'},
  link: {color:'#0ea5e9', textDecoration:'none'}
}
