import { useState, useEffect } from 'react';
import { api } from '../api';
import { useProfile } from '../context/ProfileContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import styles from './CompetitorInsights.module.css';

const PLATFORMS = ['instagram', 'twitter', 'linkedin'];

export default function CompetitorInsights() {
  const { profile } = useProfile();
  const [competitors, setCompetitors] = useState([]);
  const [meta, setMeta] = useState(null);
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getCompetitors(profile.competitors || '');
        setCompetitors(res.data.competitors);
        setMeta(res.data.meta);
      } catch { setCompetitors([]); }
      setLoading(false);
    }
    load();
  }, [profile.competitors]);

  const chartData = competitors.map(c => ({
    name: c.name,
    followers: c.platforms[platform]?.followers || 0,
    engagement: c.platforms[platform]?.engagement_rate || 0,
    posts: c.platforms[platform]?.posts_per_week || 0,
  }));

  return (
    <div className={styles.page}>
      <div className="section-header">
        <div>
          <h2 className="section-title">🔍 Competitor Insights</h2>
          <p className="section-sub">Monitor competitor performance and strategy patterns.</p>
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

      {loading && <p className={styles.loading}>Loading competitor data…</p>}

      {!loading && competitors.length > 0 && (
        <>
          {/* Followers chart */}
          <div className="card">
            <h3 className={styles.cardTitle}>Followers Comparison — {platform}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip formatter={v => [v.toLocaleString(), 'Followers']} />
                <Bar dataKey="followers" fill="#1d6fce" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement chart */}
          <div className="card">
            <h3 className={styles.cardTitle}>Engagement Rate (%) & Posts/Week — {platform}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="engagement" fill="#16a34a" radius={[4,4,0,0]} name="Eng. Rate %" />
                <Bar dataKey="posts" fill="#d97706" radius={[4,4,0,0]} name="Posts/Week" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detail cards */}
          <div className={styles.cards}>
            {competitors.map(c => (
              <div key={c.name} className={`card ${styles.compCard}`}>
                <div className={styles.compHeader}>
                  <div className={styles.compName}>{c.name}</div>
                  <div className={styles.compTone}>{c.tone}</div>
                </div>
                <div className={styles.compStats}>
                  <div className={styles.compStat}>
                    <span className={styles.statLabel}>Followers</span>
                    <span className={styles.statVal}>{(c.platforms[platform]?.followers || 0).toLocaleString()}</span>
                  </div>
                  <div className={styles.compStat}>
                    <span className={styles.statLabel}>Eng. Rate</span>
                    <span className={styles.statVal}>{c.platforms[platform]?.engagement_rate || 0}%</span>
                  </div>
                  <div className={styles.compStat}>
                    <span className={styles.statLabel}>Posts/Week</span>
                    <span className={styles.statVal}>{c.platforms[platform]?.posts_per_week || 0}</span>
                  </div>
                  <div className={styles.compStat}>
                    <span className={styles.statLabel}>Top Format</span>
                    <span className={styles.statVal}>{c.platforms[platform]?.top_content_type || '—'}</span>
                  </div>
                </div>
                <div className={styles.swGrid}>
                  <div className={styles.strength}>💪 {c.strength}</div>
                  <div className={styles.weakness}>⚠️ {c.weakness}</div>
                </div>
                <div className={styles.hashtags}>
                  {c.top_hashtags.map(h => <span key={h} className={styles.tag}>{h}</span>)}
                </div>
              </div>
            ))}
          </div>

          {meta && <p className={styles.note}>⚠️ {meta.disclaimer}</p>}
        </>
      )}
    </div>
  );
}
