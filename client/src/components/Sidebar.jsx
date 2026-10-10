import styles from './Sidebar.module.css';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',          icon: '📊' },
  { id: 'trends',       label: 'Trend Analysis',      icon: '📈' },
  { id: 'sentiment',    label: 'Sentiment Analysis',  icon: '💬' },
  { id: 'competitors',  label: 'Competitor Insights', icon: '🔍' },
  { id: 'content',      label: 'Content Generator',   icon: '✍️'  },
  { id: 'agent',        label: 'AI Agent Chat',        icon: '🤖' },
];

export default function Sidebar({ active, onNavigate, profile }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🚀</span>
        <div>
          <div className={styles.logoTitle}>Granite Social</div>
          <div className={styles.logoSub}>Powered by IBM Granite</div>
        </div>
      </div>

      {profile.brandName && (
        <div className={styles.profileChip}>
          <div className={styles.brandName}>{profile.brandName}</div>
          <div className={styles.brandIndustry}>{profile.industry}</div>
        </div>
      )}

      <nav className={styles.nav}>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${active === item.id ? styles.active : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.ibmBadge}>IBM Granite LLM</div>
        <div className={styles.footerNote}>v1.0 · For demonstration only</div>
      </div>
    </aside>
  );
}
