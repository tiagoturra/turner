import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { AudioLines, ChevronDown, ChevronRight, Globe2, Guitar, Mic, Moon, Sun, Waves } from 'lucide-react'
import { Button } from '../../../design-system/components/atoms/Button'
import { supportedLanguages } from '../../../i18n/config'
import { useTuner } from '../hooks/useTuner'
import styles from './LandingPage.module.scss'

const strings = [
  { note: 'E', octave: 2, frequency: 82.41 }, { note: 'A', octave: 2, frequency: 110 },
  { note: 'D', octave: 3, frequency: 146.83 }, { note: 'G', octave: 3, frequency: 196 },
  { note: 'B', octave: 3, frequency: 246.94 }, { note: 'E', octave: 4, frequency: 329.63 },
]
const tuningToleranceCents = 1

export function LandingPage() {
  const { t, i18n } = useTranslation(['common', 'tuner'])
  const [dark, setDark] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [activeString, setActiveString] = useState<number | null>(null)
  const { frequency, note, cents, status, start, stop } = useTuner()
  const toneRef = useRef<{ context: AudioContext; oscillator: OscillatorNode } | null>(null)
  const listening = status === 'listening'

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light' }, [dark])

  const beginTuning = () => listening ? stop() : start()
  const stateMessage = status === 'denied' ? t('tuner:tuner.permissionDenied') : status === 'unsupported' ? t('tuner:tuner.unsupported') : status === 'error' ? t('tuner:tuner.error') : listening ? t('tuner:tuner.listening') : t('tuner:tuner.hint')
  const tuningState = cents === null ? '' : Math.abs(cents) <= tuningToleranceCents ? t('tuner:tuner.inTune') : cents < 0 ? t('tuner:tuner.flat') : t('tuner:tuner.sharp')
  const meterPosition = Math.min(94, Math.max(6, 50 + (cents ?? 0) / 1.2))
  const isTuned = cents !== null && Math.abs(cents) <= tuningToleranceCents
  const currentLanguage = supportedLanguages.find((language) => language.code === i18n.language) ?? supportedLanguages[0]

  const stopTone = () => {
    const tone = toneRef.current
    if (!tone) return
    tone.oscillator.stop()
    void tone.context.close()
    toneRef.current = null
    setActiveString(null)
  }

  const playString = async (index: number) => {
    if (activeString === index) {
      stopTone()
      return
    }

    stopTone()
    const string = strings[index]
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext
    if (!AudioContextConstructor) return
    const context = new AudioContextConstructor()
    await context.resume()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = string.frequency
    oscillator.type = 'triangle'
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.04)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    toneRef.current = { context, oscillator }
    setActiveString(index)
  }

  useEffect(() => stopTone, [])

  return (
    <main className={`${styles.page} min-h-[100dvh]`}>
      <nav className={styles.nav} aria-label={t('common:brand')}>
        <a className={styles.brand} href="#top"><span className={styles.brandMark}><Waves size={19} /></span>{t('common:brand')}</a>
        <div className={styles.navLinks}>
          <a href="#como-funciona">{t('common:nav.howItWorks')}</a>
          <a href="#recursos">{t('common:nav.features')}</a>
        </div>
        <div className="relative mr-3">
          <button className="inline-flex items-center gap-1.5 border border-[var(--line)] bg-transparent px-2.5 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] min-w-36" type="button" onClick={() => setLanguageMenuOpen((open) => !open)} aria-expanded={languageMenuOpen} aria-haspopup="menu" aria-label={t('common:language.change')}><Globe2 size={14} />{t(currentLanguage.labelKey)}<ChevronDown size={13} /></button>
          {languageMenuOpen && <div className="absolute right-0 z-[200] mt-2 min-w-36 border border-[var(--line)] bg-[var(--surface)] p-1 shadow-[0_2px_8px_rgba(28,48,34,.08)]" role="menu">
            {supportedLanguages.map((language) => <button className="flex w-full items-center px-3 py-2 text-left text-xs font-medium text-[var(--ink)] transition-colors hover:bg-[var(--soft)]" type="button" role="menuitem" onClick={() => { void i18n.changeLanguage(language.code); setLanguageMenuOpen(false) }} key={language.code}>{t(language.labelKey)}</button>)}
          </div>}
        </div>
        <button className={styles.themeToggle} type="button" onClick={() => setDark(!dark)} aria-label={t(dark ? 'common:theme.light' : 'common:theme.dark')}>
          <Sun size={16} /><span className={styles.toggleRail}><span className={styles.toggleDot}>{dark ? <Moon size={13} /> : <Sun size={13} />}</span></span><Moon size={16} />
        </button>
      </nav>

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span />{t('tuner:hero.eyebrow')}</p>
          <h1>{t('tuner:hero.titleStart')} <em>{t('tuner:hero.titleAccent')}</em></h1>
          <p className={styles.lead}>{t('tuner:hero.description')}</p>
          <div className="mt-8 flex items-center gap-6"><a href="#como-funciona" className={styles.textLink}>{t('common:actions.learnMore')}<ChevronRight size={17} /></a></div>
          <p className={styles. rowserNote}><span /><span />{t('tuner:hero.note')}</p>
        </div>

        <div className={styles.tunerShell} aria-live="polite">
          <div className={styles.texture} />
          <div className={styles.tunerHeader}><span>{t('tuner:tuner.label')}</span><span className={listening ? styles.statusActive : styles.status}>{listening ? t('tuner:tuner.listening') : t('tuner:tuner.ready')}</span></div>
          <div className={styles.noteArea}>
            <span className={`${styles.noteLetter} ${isTuned ? styles.tunedNote : ''}`}>{note ?? '—'}</span>
            <span className={styles.noteState}>{tuningState || stateMessage}</span>
          </div>
          <div className={styles.meter}>
            <span className={styles.meterLabel}>{t('tuner:tuner.flat')}</span>
            <div className={styles.scale}>{Array.from({ length: 13 }, (_, i) => <i className={i === 6 ? styles.centerTick : ''} key={i} />)}<b style={{ '--position': `${meterPosition}%` } as CSSProperties} /></div>
            <span className={styles.meterLabel}>{t('tuner:tuner.sharp')}</span>
          </div>
          <div className={styles.tunerFooter}><span>{frequency ? t('tuner:tuner.frequency', { frequency: frequency.toFixed(1) }) : t('tuner:tuner.frequency', { frequency: '440' })}</span><AudioLines size={17} /></div>
          <div className={styles.tunerControls}>
            <Button className="self-center" onClick={beginTuning}><Mic size={18} />{t(listening ? 'common:actions.stop' : 'common:actions.start')}</Button>
            <div className={styles.stringControl}>
              <p>{t('tuner:tuner.strings')}</p>
              <div className={styles.strings}>{strings.map((string, index) => <button type="button" onClick={() => void playString(index)} className={index === activeString ? styles.selectedString : ''} aria-pressed={index === activeString} aria-label={t('tuner:tuner.playString', { note: `${string.note}${string.octave}` })} key={`${string.note}-${string.octave}`}>{string.note}<small>{string.octave}</small></button>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.steps} id="como-funciona">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>{t('tuner:how.eyebrow')}</p><h2>{t('tuner:how.title')}</h2></div>
        <div className={styles.stepList}>{(t('tuner:how.items', { returnObjects: true }) as Array<{number: string; title: string; text: string}>).map((item) => <article className={styles.step} key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className={styles.feature} id="recursos">
        <div className={styles.featureVisual}><Guitar size={88} strokeWidth={1} /><i /><i /><i /></div>
        <div className={styles.featureCopy}><p className={styles.eyebrow}>{t('tuner:feature.eyebrow')}</p><h2>{t('tuner:feature.title')}</h2><p>{t('tuner:feature.description')}</p><ul>{(t('tuner:feature.items', { returnObjects: true }) as string[]).map((item) => <li key={item}><span />{item}</li>)}</ul></div>
      </section>

      <footer className={styles.footer}><span>{t('tuner:footer.line')}</span><span>{t('tuner:footer.copyright')}</span></footer>
    </main>
  )
}
