import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight, Check, ChevronDown, Facebook, Globe2, Instagram, LockKeyhole, Mail, Menu, Search, Sparkles, X, Youtube, Zap } from 'lucide-react'

const sources = [
  { name: 'YouTube', icon: Youtube },
  { name: 'Instagram', icon: Instagram },
  { name: 'X / Twitter', icon: X },
  { name: 'Facebook', icon: Facebook },
  { name: 'ChatGPT', icon: Sparkles },
  { name: 'Gemini', icon: Zap },
  { name: 'Web browsers', icon: Globe2 },
]

const quickFilters = ['High-yield business ideas', 'YouTube content & scripts', 'Future tech & venture concepts']

function Splash({ onContinue }: { onContinue: () => void }) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const first = window.setTimeout(() => setStage(1), 2200)
    const second = window.setTimeout(() => setStage(2), 4400)
    return () => { window.clearTimeout(first); window.clearTimeout(second) }
  }, [])
  return <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: .75 }} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#08101d] px-6">
    <div className="scan-grid absolute inset-0 opacity-40" />
    <div className="absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 shadow-[0_0_120px_rgba(20,184,226,.18)]" />
    <div className="relative flex max-w-3xl flex-col items-center text-center">
      <span className="mb-8 font-mono text-[10px] uppercase tracking-[.42em] text-cyan-300/70">M735 / intelligence protocol</span>
      <AnimatePresence mode="wait">
        <motion.h1 key={stage < 1 ? 'abid' : 'zain'} initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .8 }} className="max-w-3xl text-balance text-4xl font-semibold tracking-[-.055em] text-slate-100 sm:text-7xl">
          {stage < 1 ? 'Rai Abid Hussain Anjum Marth' : 'Rai Zain Ul Abadeen Marth'}
        </motion.h1>
      </AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: stage >= 2 ? 1 : 0 }} transition={{ duration: .8 }} className="mt-12">
        <button onClick={onContinue} className="group inline-flex items-center gap-3 border border-cyan-300/50 bg-cyan-300 px-7 py-3 font-mono text-xs font-bold uppercase tracking-[.22em] text-[#08101d] shadow-[0_0_30px_rgba(103,232,249,.32)] transition hover:bg-slate-100">Continue <ArrowUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
      </motion.div>
      <span className="mt-8 font-mono text-[10px] uppercase tracking-[.28em] text-slate-500">Synthesis awaits your direction</span>
    </div>
  </motion.div>
}

function AuthModal({ onClose, onUnlock }: { onClose: () => void; onUnlock: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')
  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#050a12]/80 p-4 backdrop-blur-md">
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="panel relative w-full max-w-md p-6 sm:p-8">
      <button aria-label="Close authentication" onClick={onClose} className="absolute right-5 top-5 text-slate-500 transition hover:text-slate-100"><X className="size-4" /></button>
      <div className="mb-8 flex size-10 items-center justify-center border border-cyan-300/30 bg-cyan-300/10 text-cyan-300"><LockKeyhole className="size-5" /></div>
      <p className="eyebrow">Restricted intelligence layer</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">Unlock your hub</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">Sign in to save research threads and access unified viewpoints.</p>
      <button onClick={onUnlock} className="mt-7 flex w-full items-center justify-center gap-3 border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/50"><span className="text-lg font-semibold">G</span> Continue with Google</button>
      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[.24em] text-slate-600"><span className="h-px flex-1 bg-slate-800" />or email OTP<span className="h-px flex-1 bg-slate-800" /></div>
      {!sent ? <div className="flex gap-2"><div className="relative flex-1"><Mail className="absolute left-3 top-3.5 size-4 text-slate-500" /><input aria-label="Email address" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="field pl-10" /></div><button disabled={!email} onClick={() => setSent(true)} className="button-primary disabled:cursor-not-allowed disabled:opacity-40">Next</button></div> : <div className="flex gap-2"><input autoFocus aria-label="Verification code" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} className="field flex-1" /><button onClick={onUnlock} className="button-primary">Verify</button></div>}
      {sent && <p className="mt-3 text-xs text-cyan-300">Demo OTP sent. Enter any 6 digits to continue.</p>}
    </motion.div>
  </div>
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState(quickFilters[0])
  const [submitted, setSubmitted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const output = useMemo(() => query || 'Build a media-first business around practical AI workflows for independent creators.', [query])
  const runSynthesis = () => { if (!authenticated) return setShowAuth(true); setSubmitted(true) }
  const unlock = () => { setAuthenticated(true); setShowAuth(false) }
  return <div className="min-h-screen bg-[#08101d] text-slate-100 font-sans selection:bg-cyan-300 selection:text-[#08101d]">
    <AnimatePresence>{showSplash && <Splash onContinue={() => setShowSplash(false)} />}</AnimatePresence>
    {showAuth && <AuthModal onClose={() => setShowAuth(false)} onUnlock={unlock} />}
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#08101d]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
      <a href="#top" className="flex items-center gap-3"><span className="flex size-9 items-center justify-center border border-cyan-300/60 text-sm font-bold text-cyan-300">M7</span><span className="text-lg font-semibold tracking-[-.05em]">Marth <span className="text-cyan-300">735</span></span></a>
      <div className="hidden items-center gap-8 md:flex"><a href="#synthesis" className="nav-link">Synthesis</a><a href="#sources" className="nav-link">Sources</a><a href="#insight" className="nav-link">Insight</a></div>
      <div className="hidden max-w-[260px] items-center gap-2 text-right lg:flex"><span className="size-1.5 animate-pulse rounded-full bg-cyan-300" /><span className="truncate font-mono text-[10px] uppercase tracking-[.12em] text-slate-400">Zain Marth / son of Abid Hussain Anjum</span></div>
      <button aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden"><Menu className="size-5" /></button>
    </div>{menuOpen && <div className="border-t border-slate-800 px-5 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm text-slate-400"><a href="#synthesis" onClick={() => setMenuOpen(false)}>Synthesis</a><a href="#sources" onClick={() => setMenuOpen(false)}>Sources</a><a href="#insight" onClick={() => setMenuOpen(false)}>Insight</a></div></div>}</header>
    <main id="top" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
      <section className="mx-auto max-w-4xl text-center"><div className="eyebrow inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-cyan-300" />live intelligence workspace</div><h1 className="mt-6 text-balance text-5xl font-semibold tracking-[-.07em] sm:text-8xl">Think further.<br /><span className="text-cyan-300">Build smarter.</span></h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-400 sm:text-lg">One prompt. Many perspectives. Marth 735 synthesizes the signal across the internet into an actionable point of view.</p></section>
      <section id="synthesis" className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_.65fr]"><div className="panel p-5 sm:p-7"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">01 / ask the engine</p><h2 className="mt-2 text-xl font-medium">What are you exploring?</h2></div><span className="font-mono text-[10px] text-slate-500">{query.length}/500</span></div><textarea value={query} onChange={e => setQuery(e.target.value.slice(0, 500))} placeholder="Ask about a business, content strategy, or future venture..." className="field min-h-36 resize-none" /><div className="mt-5 flex flex-wrap gap-2">{quickFilters.map(filter => <button key={filter} onClick={() => setActiveFilter(filter)} className={`chip ${activeFilter === filter ? 'chip-active' : ''}`}>{filter}</button>)}</div><div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">Add context, constraints, or a desired outcome.</p><button onClick={runSynthesis} className="button-primary group">Synthesize insight <ArrowUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></button></div></div>
        <div id="sources" className="panel p-5 sm:p-7"><button onClick={() => setSourcesOpen(!sourcesOpen)} className="flex w-full items-center justify-between text-left"><div><p className="eyebrow">02 / signal map</p><h2 className="mt-2 text-xl font-medium">Source synthesis</h2></div><ChevronDown className={`size-4 text-slate-500 transition ${sourcesOpen ? 'rotate-180' : ''}`} /></button>{sourcesOpen && <div className="mt-7 flex flex-col gap-3">{sources.map(({ name, icon: Icon }, index) => <div key={name} className="flex items-center justify-between border-b border-slate-800/70 pb-3 last:border-0"><span className="flex items-center gap-3 text-sm text-slate-300"><Icon className="size-4 text-slate-500" />{name}</span><span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-cyan-300"><span className={`size-1.5 rounded-full ${index === 5 ? 'bg-amber-300' : 'bg-cyan-300'}`} />{index === 5 ? 'queued' : 'active'}</span></div>)}</div>}</div></section>
      <section id="insight" className="mt-6 panel overflow-hidden"><div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><p className="eyebrow">03 / unified viewpoint</p><h2 className="mt-2 text-xl font-medium">Your intelligence brief</h2></div><div className="flex items-center gap-2">{submitted && <span className="badge"><Check className="size-3" />synthesized</span>}<button onClick={() => { navigator.clipboard?.writeText(output); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }} className="button-quiet">{copied ? 'Copied' : 'Copy brief'}</button></div></div><div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_280px]"><div><p className="text-lg leading-8 text-slate-200">{submitted ? output : 'Your brief will appear here after you unlock the synthesis engine and submit a direction.'}</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="metric"><span>Signal confidence</span><strong>{submitted ? '94%' : '—'}</strong></div><div className="metric"><span>Perspectives</span><strong>{submitted ? '07' : '—'}</strong></div><div className="metric"><span>Next move</span><strong>{submitted ? '48h' : '—'}</strong></div></div></div><div className="border-l border-slate-800 pl-0 lg:pl-7"><p className="eyebrow">Recommended path</p><ol className="mt-5 flex flex-col gap-5">{['Define the sharpest audience pain.', 'Test one repeatable distribution loop.', 'Package the learning into an offer.'].map((step, i) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-400"><span className="font-mono text-cyan-300">0{i + 1}</span>{step}</li>)}</ol></div></div></section>
      <footer className="mt-20 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>MARTH 735 / PRIVATE INTELLIGENCE HUB</span><span className="font-mono">Built for Rai Zain Ul Abadeen Marth</span></footer>
    </main>
  </div>
}

export { Search }
