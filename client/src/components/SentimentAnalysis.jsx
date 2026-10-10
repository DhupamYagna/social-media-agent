import { useState, useEffect } from 'react';
import { api } from '../api';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import styles from './SentimentAnalysis.module.css';

const PLATFORMS = ['instagram','twitter','linkedin'];

const EMOTION_COLORS = {
  joy: '#f59e0b', trust: '#1d6fce', anticipation: '#7c3aed',
  surprise: '#ec4899', fear: '#64748b', sadness: '#94a3b8', disgust: '#ef4444',
};

export default function SentimentAnalysis() {
  const [platform, setPlatform] = useState('instagram');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(p) {
    setLoading(true);
    try {
      const res = await api.getSentiment(p);
      setData(res.data.sentiment);
    } catch { setData(null); }
    setLoading(false);
  }

  useEffect(() => { load(platform); }, [platform]);

  const trendData = data?.trend?.map((v, i) => ({ week: `W${i+1}`, score: v })) || [];
  const emotionData = data ? Object.entries(data.emotions).map(([k, v]) => ({ name: k, value: v, fill: EMOTION_COLORS[k] })) : [];

  const scoreColor = !data ? '#9ca3af' : data.overall_score >= 70 ? '#16a34a' : data.overall_score >= 50 ? '#d97706' : '#dc2626';

  return (
    <div className={styles.page}>
      <div className="section-header">
        <div>
          <h2 className="section-title">💬 Sentiment Analysis</h2>
          <p className="section-sub">Understand how your audience feels across platforms.</p>
        </div>
        <span className="sample-badge">⚠️ SAMPLE DATA</span>
      </div>

      <div className={styles.tabs}>
        {PLATFORMS.map(p => (
          <button key={p} className={`${styles.tab} ${platform === p ? styles.activeTab : ''}`} onClick={() => setPlatform(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className={styles.loading}>Analyzing sentiment…</p>}

      {!loading && data && (
        <div className={styles.grid}>
          {/* Overall score */}
          <div className={`card ${styles.scoreCard}`}>
            <h3 className={styles.cardTitle}>Overall Sentiment Score</h3>
            <div className={styles.scoreBig} style={{ color: scoreColor }}>{data.overall_score}</div>
            <div className={styles.scoreLabel} style={{ color: scoreColor }}>{data.label}</div>
            <div className={styles.breakdown}>
              <span className={styles.bPos}>😊 {data.breakdown.positive}% Positive</span>
              <span className={styles.bNeu}>😐 {data.breakdown.neutral}% Neutral</span>
              <span className={styles.bNeg}>😞 {data.breakdown.negative}% Negative</span>
            </div>
          </div>

          {/* Trend line */}
          <div className={`card ${styles.trendCard}`}>
            <h3 className={styles.cardTitle}>Sentiment Trend (8 Weeks)</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Emotion breakdown */}
          <div className={`card ${styles.emotionCard}`}>
            <h3 className={styles.cardTitle}>Emotion Breakdown</h3>
            <div className={styles.emotionGrid}>
              {emotionData.map(e => (
                <div key={e.name} className={styles.emotionItem}>
                  <div className={styles.emotionBar}>
                    <div className={styles.emotionFill} style={{ width: `${e.value}%`, background: e.fill }} />
                  </div>
                  <div className={styles.emotionLabel}>{e.name}</div>
                  <div className={styles.emotionVal}>{e.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top comments */}
          <div className={`card ${styles.commentsCard}`}>
            <h3 className={styles.cardTitle}>Representative Comments</h3>
            <div className={styles.commentsSection}>
              <div className={styles.commentsLabel}>✅ Positive</div>
              {data.top_positive_comments.map((c, i) => <div key={i} className={`${styles.comment} ${styles.commentPos}`}>"{c}"</div>)}
            </div>
            <div className={styles.commentsSection}>
              <div className={styles.commentsLabel}>⚠️ Needs Attention</div>
              {data.top_negative_comments.map((c, i) => <div key={i} className={`${styles.comment} ${styles.commentNeg}`}>"{c}"</div>)}
            </div>
            <p className={styles.note}>⚠️ Sample comments — not real user data.</p>
          </div>
        </div>
      )}
    </div>
  );
}
