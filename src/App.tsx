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
        <Route path="/" element={<Dashboard />} />
        <Route path="/coding" element={<LiveCoding />} />
        <Route path="/architecture" element={<ArchitectureDesign />} />
        <Route path="/system-design" element={<SystemDesign />} />
        <Route path="/debugging" element={<Debugging />} />
        <Route path="/database" element={<DatabaseAPI />} />
        <Route path="/security" element={<Security />} />
        <Route path="/results" element={<Results />} />
      </Routes>
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
