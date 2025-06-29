import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LetterTemplatesProvider } from '@/contexts/LetterImageContext';
import { ScheduleProvider } from '@/contexts/ScheduleContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { ThemeProvider } from '@/contexts/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <AdminAuthProvider>
        <LetterTemplatesProvider>
          <ScheduleProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
          </ScheduleProvider>
        </LetterTemplatesProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </Router>
);