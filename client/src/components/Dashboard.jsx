import { useState, useEffect } from 'react';
import { api } from '../api';
import { useProfile } from '../context/ProfileContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './Dashboard.module.css';

const COLORS = ['#1d6fce','#16a34a','#d97706','#7c3aed','#dc2626'];

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const { profile } = useProfile();
  const [trends, setTrends] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, sRes, hRes] = await Promise.all([
          api.getTrends(profile.platforms?.[0]?.toLowerCase().replace('/x','') || 'instagram'),
          api.getSentiment('instagram'),
          api.health(),
        ]);
        setTrends(tRes.data.trends.slice(0, 5));
        setSentiment(sRes.data.sentiment);
        setStatus(hRes.data);
      } catch { /* server may not be running */ }
      setLoading(false);
    }
    load();
  }, [profile]);

  const topTrend = trends[0];
  const sentimentScore = sentiment?.overall_score ?? '--';
  const sentimentLabel = sentiment?.label ?? '';

  return (
    <div className={styles.page}>
      <div className="section-header">
        <div>
          <h2 className="section-title">📊 Dashboard</h2>
          <p className="section-sub">Welcome back{profile.brandName ? `, ${profile.brandName}` : ''}! Here's your social media overview.</p>
        </div>
        <span className="sample-badge">⚠️ SAMPLE DATA</span>
      </div>

      {/* Server status banner */}
      {status && (
        <div className={`${styles.banner} ${status.granite_configured ? styles.bannerGreen : styles.bannerYellow}`}>
          🤖 IBM Granite: {status.granite_configured ? '✅ Live Mode — IBM Granite LLM active' : '⚠️ Mock Mode — Add WATSONX_API_KEY to .env for live AI responses'}
        </div>
      )}

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        <StatCard icon="😊" label="Audience Sentiment"  value={sentimentScore}   sub={sentimentLabel} color="#16a34a" />
        <StatCard icon="📈" label="Top Trend Growth"    value={topTrend ? `+${topTrend.growth}%` : '--'} sub={topTrend?.hashtag} color="#1d6fce" />
        <StatCard icon="🏷️" label="Trending Hashtags"   value={trends.length}    sub="This week"      color="#d97706" />
        <StatCard icon="🎯" label="Active Platforms"    value={profile.platforms?.length || 0} sub="Configured" color="#7c3aed" />
      </div>

      {/* Trend chart */}
      {trends.length > 0 && (
        <div className={`card ${styles.chartCard}`}>
          <h3 className={styles.chartTitle}>📈 Top Trending Topics — {profile.platforms?.[0] || 'Instagram'}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="hashtag" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => [`${val}%`, 'Growth']} />
              <Bar dataKey="growth" radius={[6,6,0,0]}>
                {trends.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className={styles.chartNote}>Sample data. Not representative of real social media trends.</p>
        </div>
      )}

      {/* Sentiment breakdown */}
      {sentiment && (
        <div className={`card ${styles.sentimentCard}`}>
          <h3 className={styles.chartTitle}>💬 Sentiment Snapshot — Instagram</h3>
          <div className={styles.sentimentBar}>
            <div className={styles.sbPos} style={{ width: `${sentiment.breakdown.positive}%` }}>{sentiment.breakdown.positive}%</div>
            <div className={styles.sbNeu} style={{ width: `${sentiment.breakdown.neutral}%` }}>{sentiment.breakdown.neutral}%</div>
            <div className={styles.sbNeg} style={{ width: `${sentiment.breakdown.negative}%` }}>{sentiment.breakdown.negative}%</div>
          </div>
          <div className={styles.sbLegend}>
            <span className={styles.legPos}>● Positive</span>
            <span className={styles.legNeu}>● Neutral</span>
            <span className={styles.legNeg}>● Negative</span>
          </div>
        </div>
      )}

      {loading && <p className={styles.loading}>Loading dashboard data…</p>}

      {/* Quick actions */}
      <div className={styles.quickActions}>
        <button className="btn btn-primary" onClick={() => onNavigate('trends')}>📈 View Trends</button>
        <button className="btn btn-success" onClick={() => onNavigate('content')}>✍️ Generate Content</button>
        <button className="btn btn-outline" onClick={() => onNavigate('agent')}>🤖 Ask AI Agent</button>
      </div>
    </div>
  );
}
