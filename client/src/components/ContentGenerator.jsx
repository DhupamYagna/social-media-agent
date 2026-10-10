import { useState } from 'react';
import { api } from '../api';
import { useProfile } from '../context/ProfileContext';
import styles from './ContentGenerator.module.css';

const PLATFORMS = ['Instagram', 'Twitter/X', 'LinkedIn', 'Facebook'];

export default function ContentGenerator() {
  const { profile } = useProfile();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!topic.trim()) { setError('Please enter a topic or keyword.'); return; }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await api.generateContent(profile, topic, platform);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to generate content. Make sure the server is running.');
    }
    setLoading(false);
  }

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className={styles.page}>
      <div className="section-header">
        <div>
          <h2 className="section-title">✍️ Content Generator</h2>
          <p className="section-sub">Generate AI-powered captions, hashtags, and campaign ideas.</p>
        </div>
        {result?.source === 'Mock Response' && <span className="sample-badge">⚠️ MOCK MODE</span>}
        {result?.source === 'IBM Granite LLM' && <span className={styles.liveBadge}>🤖 IBM Granite LLM</span>}
      </div>

      <div className={`card ${styles.inputCard}`}>
        <div className={styles.inputRow}>
          <div className={styles.field}>
            <label>Topic / Keyword *</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g. product launch, sustainability, AI tools…"
            />
          </div>
          <div className={styles.field}>
            <label>Platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.profilePreview}>
          <span>🏢 {profile.brandName || 'Your Brand'}</span>
          <span>🏭 {profile.industry || 'Industry'}</span>
          <span>🎯 {profile.audience || 'Audience'}</span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className="btn btn-primary" onClick={generate} disabled={loading || !topic.trim()}>
          {loading ? '⏳ Generating…' : '✨ Generate Content'}
        </button>
      </div>

      {result && (
        <div className={styles.results}>
          {/* Caption */}
          <div className={`card ${styles.resultCard}`}>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultTitle}>📝 Caption</h3>
              <button className={styles.copyBtn} onClick={() => copy(result.caption)}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div className={styles.caption}>{result.caption}</div>
            {result.note && <p className={styles.note}>{result.note}</p>}
          </div>

          {/* Hashtags */}
          {result.hashtags?.length > 0 && (
            <div className={`card ${styles.resultCard}`}>
              <h3 className={styles.resultTitle}>🏷️ Hashtags</h3>
              <div className={styles.hashtagGrid}>
                {result.hashtags.map(h => (
                  <span key={h} className={styles.hashTag} onClick={() => copy(h)} title="Click to copy">{h}</span>
                ))}
              </div>
              <p className={styles.hashtagHint}>Click a hashtag to copy it</p>
            </div>
          )}

          {/* Campaign ideas */}
          {result.ideas?.length > 0 && (
            <div className={`card ${styles.resultCard}`}>
              <h3 className={styles.resultTitle}>💡 Campaign Ideas</h3>
              <div className={styles.ideas}>
                {result.ideas.map((idea, i) => (
                  <div key={i} className={styles.idea}>
                    <span className={styles.ideaNum}>{i + 1}</span>
                    <span>{idea}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.disclaimer}>
        <strong>⚖️ AI Ethics Reminder:</strong> All AI-generated content should be reviewed by a human before publishing.
        Ensure content complies with platform guidelines and is accurate, respectful, and non-discriminatory.
      </div>
    </div>
  );
}
