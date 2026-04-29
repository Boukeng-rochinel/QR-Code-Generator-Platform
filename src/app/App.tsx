import { useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { MainApp } from './components/MainApp';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <MainApp onLogout={() => setIsAuthenticated(false)} />;
}
