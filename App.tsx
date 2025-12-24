
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ReporterView from './components/ReporterView';
import AdminView from './components/AdminView';
import ChatBot from './components/ChatBot';
import { AppView, IssueReport, IssueStatus, IssueCategory } from './types';

// Mock initial data for visualization
const INITIAL_REPORTS: IssueReport[] = [
  {
    id: 'm1',
    category: IssueCategory.LIGHTING,
    description: 'Street lamp outside Library is flickering violently at night.',
    status: IssueStatus.IN_PROGRESS,
    location: { latitude: 34.0522, longitude: -118.2437 },
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000,
    aiAssessment: 'Medium Urgency: Check wiring and replace bulb.'
  },
  {
    id: 'm2',
    category: IssueCategory.INTERNET,
    description: 'WiFi signal completely dropped in West Dorm Room 402.',
    status: IssueStatus.SUBMITTED,
    location: { latitude: 34.0525, longitude: -118.2430 },
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('reporter');
  const [reports, setReports] = useState<IssueReport[]>(() => {
    const saved = localStorage.getItem('campus_resolve_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem('campus_resolve_reports', JSON.stringify(reports));
  }, [reports]);

  const handleNewReport = (report: IssueReport) => {
    setReports(prev => [...prev, report]);
  };

  const handleUpdateStatus = (id: string, newStatus: IssueStatus) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { ...report, status: newStatus, updatedAt: Date.now() } 
        : report
    ));
  };

  return (
    <>
      <Layout activeView={activeView} onViewChange={setActiveView}>
        {activeView === 'reporter' ? (
          <ReporterView 
            onSubmit={handleNewReport} 
            myReports={reports} 
          />
        ) : (
          <AdminView 
            reports={reports} 
            onUpdateStatus={handleUpdateStatus} 
          />
        )}
      </Layout>
      <ChatBot />
    </>
  );
};

export default App;
