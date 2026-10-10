import { useState } from 'react';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TrendAnalysis from './components/TrendAnalysis';
import SentimentAnalysis from './components/SentimentAnalysis';
import CompetitorInsights from './components/CompetitorInsights';
import ContentGenerator from './components/ContentGenerator';
import AgentChat from './components/AgentChat';
import './index.css';

const PAGES = {
  dashboard:   Dashboard,
  trends:      TrendAnalysis,
  sentiment:   SentimentAnalysis,
  competitors: CompetitorInsights,
  content:     ContentGenerator,
  agent:       AgentChat,
};

function AppInner() {
  const { onboarded } = useProfile();
  const [page, setPage] = useState('dashboard');
  const { profile } = useProfile();

  const PageComponent = PAGES[page] || Dashboard;

  return (
    <>
      {!onboarded && <Onboarding />}
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar active={page} onNavigate={setPage} profile={profile} />
        <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto', maxWidth: 'calc(100vw - 230px)' }}>
          <PageComponent onNavigate={setPage} />
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <AppInner />
    </ProfileProvider>
  );
}
