import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import styles from './Onboarding.module.css';

const PLATFORMS = ['Instagram', 'Twitter/X', 'LinkedIn', 'Facebook', 'TikTok'];

const STEPS = [
  { title: 'Brand Basics',          sub: 'Tell us about your brand' },
  { title: 'Target Audience',       sub: 'Who are you speaking to?' },
  { title: 'Platforms & Goals',     sub: 'Where and what do you want to achieve?' },
  { title: 'Competitor Tracking',   sub: 'Who should we monitor?' },
];

export default function Onboarding() {
  const { profile, setProfile, setOnboarded } = useProfile();
  const [step, setStep] = useState(0);
  const [local, setLocal] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (step === 0 && !local.brandName.trim()) e.brandName = 'Brand name is required';
    if (step === 0 && !local.industry.trim()) e.industry = 'Industry is required';
    if (step === 1 && !local.audience.trim()) e.audience = 'Target audience is required';
    if (step === 2 && local.platforms.length === 0) e.platforms = 'Select at least one platform';
    if (step === 2 && !local.goals.trim()) e.goals = 'Campaign goals are required';
    return e;
  }

  function next() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    setProfile(local);
    setOnboarded(true);
  }

  function togglePlatform(p) {
    setLocal(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p],
    }));
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Progress */}
        <div className={styles.progress}>
          {STEPS.map((s, i) => (
            <div key={i} className={`${styles.progressDot} ${i <= step ? styles.done : ''}`}>
              <div className={styles.dot}>{i < step ? '✓' : i + 1}</div>
              {i < STEPS.length - 1 && <div className={styles.progressLine} />}
            </div>
          ))}
        </div>

        <div className={styles.header}>
          <div className={styles.logo}>🚀 Granite Social Coach</div>
          <h2 className={styles.stepTitle}>{STEPS[step].title}</h2>
          <p className={styles.stepSub}>{STEPS[step].sub}</p>
        </div>

        <div className={styles.body}>
          {step === 0 && (
            <>
              <div className={styles.field}>
                <label>Brand / Company Name *</label>
                <input value={local.brandName} onChange={e => setLocal(p => ({ ...p, brandName: e.target.value }))} placeholder="e.g. TechFlow Inc." />
                {errors.brandName && <span className={styles.err}>{errors.brandName}</span>}
              </div>
              <div className={styles.field}>
                <label>Industry *</label>
                <input value={local.industry} onChange={e => setLocal(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. SaaS, E-commerce, Healthcare..." />
                {errors.industry && <span className={styles.err}>{errors.industry}</span>}
              </div>
            </>
          )}

          {step === 1 && (
            <div className={styles.field}>
              <label>Target Audience *</label>
              <textarea rows={3} value={local.audience} onChange={e => setLocal(p => ({ ...p, audience: e.target.value }))} placeholder="e.g. Tech-savvy professionals aged 25-40, interested in productivity tools..." />
              {errors.audience && <span className={styles.err}>{errors.audience}</span>}
            </div>
          )}

          {step === 2 && (
            <>
              <div className={styles.field}>
                <label>Preferred Platforms *</label>
                <div className={styles.platformGrid}>
                  {PLATFORMS.map(p => (
                    <button key={p} type="button"
                      className={`${styles.platformBtn} ${local.platforms.includes(p) ? styles.selected : ''}`}
                      onClick={() => togglePlatform(p)}
                    >{p}</button>
                  ))}
                </div>
                {errors.platforms && <span className={styles.err}>{errors.platforms}</span>}
              </div>
              <div className={styles.field}>
                <label>Campaign Goals *</label>
                <textarea rows={2} value={local.goals} onChange={e => setLocal(p => ({ ...p, goals: e.target.value }))} placeholder="e.g. Increase brand awareness, drive website traffic, generate leads..." />
                {errors.goals && <span className={styles.err}>{errors.goals}</span>}
              </div>
            </>
          )}

          {step === 3 && (
            <div className={styles.field}>
              <label>Competitor Names (comma-separated)</label>
              <input value={local.competitors} onChange={e => setLocal(p => ({ ...p, competitors: e.target.value }))} placeholder="e.g. BrandAlpha, MarketLeader, StartupRival" />
              <p className={styles.hint}>We'll monitor these competitors' social media activity for you.</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {step > 0 && (
            <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <button className="btn btn-primary" onClick={next}>
            {step < STEPS.length - 1 ? 'Next →' : '🚀 Launch Dashboard'}
          </button>
        </div>

        <p className={styles.disclaimer}>
          🔒 Your data is only used within this session and never stored on our servers.
        </p>
      </div>
    </div>
  );
}
