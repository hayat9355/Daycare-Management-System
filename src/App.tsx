import React, { useState } from 'react';
import { ToastProvider } from './components/Toast';
import Shell, { type Page } from './components/Shell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Children from './pages/Children';
import DailyReports from './pages/DailyReports';
import Billing from './pages/Billing';
import Staff from './pages/Staff';
import Calendar from './pages/Calendar';
import Gallery from './pages/Gallery';
import Communication from './pages/Communication';
import Waitlist from './pages/Waitlist';

function DMS() {
  const [page, setPage] = useState<Page>('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('dms_remember');
    window.location.reload();
  };

  const CurrentPage = () => {
    switch (page) {
      case 'dashboard':     return <Dashboard onNav={setPage} />;
      case 'attendance':    return <Attendance />;
      case 'children':      return <Children />;
      case 'reports':       return <DailyReports />;
      case 'billing':       return <Billing />;
      case 'staff':         return <Staff />;
      case 'calendar':      return <Calendar />;
      case 'gallery':       return <Gallery />;
      case 'communication': return <Communication />;
      case 'waitlist':      return <Waitlist />;
      default:              return <Dashboard onNav={setPage} />;
    }
  };

  return (
    <Shell active={page} onNav={setPage} onLogout={handleLogout}>
      <CurrentPage />
    </Shell>
  );
}

function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('dms_remember'));

  return (
    <ToastProvider>
      {authed ? <DMS /> : <Login onLogin={() => setAuthed(true)} />}
    </ToastProvider>
  );
}

export default App;
