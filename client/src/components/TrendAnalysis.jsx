import { useState, useEffect } from 'react';
import { api } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import styles from './TrendAnalysis.module.css';

const PLATFORMS = ['instagram','twitter','linkedin','facebook'];
const COLORS = ['#1d6fce','#16a34a','#d97706','#7c3aed','#dc2626'];

export default function TrendAnalysis() {
  const [platform, setPlatform] = useState('instagram');
  const [trends, setTrends] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(p) {
    setLoading(true);
    try {
      const res = await api.getTrends(p);
      setTrends(res.data.trends);
      setMeta(res.data.meta);
    } catch { setTrends([]); }
    setLoading(false);
  }

  useEffect(() => { load(platform); }, [platform]);

  return (
    <div className={styles.page}>
      <div className="section-header">
        <div>
          <h2 className="section-title">📈 Trend Analysis</h2>
          <p className="section-sub">Discover rising topics and hashtags across platforms.</p>
        </div>
        <span className="sample-badge">⚠️ SAMPLE DATA</span>
      </div>

      {/* Platform tabs */}
      <div className={styles.tabs}>
        {PLATFORMS.map(p => (
          <button key={p} className={`${styles.tab} ${platform === p ? styles.activeTab : ''}`} onClick={() => setPlatform(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className={styles.loading}>Fetching trends…</p>}

      {!loading && trends.length > 0 && (
        <>
          {/* Growth bar chart */}
          <div className="card">
            <h3 className={styles.cardTitle}>Growth Rate (%) — {platform}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hashtag" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} interval={0} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, 'Growth']} />
                <Bar dataKey="growth" radius={[6,6,0,0]}>
                  {trends.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="card">
            <h3 className={styles.cardTitle}>Trending Hashtags Detail</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th><th>Hashtag</th><th>Topic</th><th>Growth</th><th>Posts</th><th>Eng. Rate</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((t, i) => (
                  <tr key={t.hashtag}>
                    <td>{i + 1}</td>
                    <td><span className={styles.hashtag}>{t.hashtag}</span></td>
                    <td>{t.topic}</td>
                    <td><span className={styles.growth}>+{t.growth}%</span></td>
                    <td>{t.posts.toLocaleString()}</td>
                    <td>{t.engagement_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {meta && <p className={styles.note}>⚠️ {meta.disclaimer}</p>}
          </div>
        </>
      )}
    </div>
  );
}
