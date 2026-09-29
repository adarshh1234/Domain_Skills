import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { LiveCoding } from './pages/LiveCoding';
import { ArchitectureDesign } from './pages/ArchitectureDesign';
import { SystemDesign } from './pages/SystemDesign';
import { Debugging } from './pages/Debugging';
import { DatabaseAPI } from './pages/DatabaseAPI';
import { Security } from './pages/Security';
import { Results } from './pages/Results';

// Onboarding & Skills Intelligence Pages
import { OnboardingDashboard } from './pages/onboarding/OnboardingDashboard';
import { PersonalInfo } from './pages/onboarding/PersonalInfo';
import { Documents } from './pages/onboarding/Documents';
import { Approvals } from './pages/onboarding/Approvals';
import { MLAnalysis } from './pages/onboarding/MLAnalysis';
import { Analytics } from './pages/onboarding/Analytics';
import { Checklist } from './pages/onboarding/Checklist';

// AI Chatbot Assistant
import { AIChatbot } from './components/onboarding/AIChatbot';
import { storageService } from './services/storage';
import { AssessmentSession } from './types/session';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const [session, setSession] = useState<AssessmentSession | null>(() => storageService.getSession());

  // Refresh active session from localStorage when route changes
  useEffect(() => {
    const current = storageService.getSession();
    if (current && current.status === 'active') {
      setSession(current);
    } else {
      setSession(null);
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Navigation session={session} />
      <Routes>
        {/* Domain Skills Technical Assessment Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/coding" element={<LiveCoding />} />
        <Route path="/architecture" element={<ArchitectureDesign />} />
        <Route path="/system-design" element={<SystemDesign />} />
        <Route path="/debugging" element={<Debugging />} />
        <Route path="/database" element={<DatabaseAPI />} />
        <Route path="/security" element={<Security />} />
        <Route path="/results" element={<Results />} />

        {/* AI Onboarding & Skills Intelligence Routes */}
        <Route path="/onboarding" element={<OnboardingDashboard />} />
        <Route path="/onboarding/personal" element={<PersonalInfo />} />
        <Route path="/onboarding/documents" element={<Documents />} />
        <Route path="/onboarding/approvals" element={<Approvals />} />
        <Route path="/onboarding/ml-analysis" element={<MLAnalysis />} />
        <Route path="/onboarding/analytics" element={<Analytics />} />
        <Route path="/onboarding/checklist" element={<Checklist />} />
      </Routes>

      {/* Floating AI Onboarding Assistant */}
      <AIChatbot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
