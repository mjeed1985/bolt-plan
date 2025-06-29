import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/AuthContext';
<<<<<<< HEAD
import { LetterTemplatesProvider } from '@/contexts/LetterImageContext';
=======
import { LetterImageProvider } from '@/contexts/LetterImageContext';
>>>>>>> cd51de4 (initial push)
import { ScheduleProvider } from '@/contexts/ScheduleContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { ThemeProvider } from '@/contexts/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <AdminAuthProvider>
<<<<<<< HEAD
        <LetterTemplatesProvider>
=======
        <LetterImageProvider>
>>>>>>> cd51de4 (initial push)
          <ScheduleProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
          </ScheduleProvider>
<<<<<<< HEAD
        </LetterTemplatesProvider>
=======
        </LetterImageProvider>
>>>>>>> cd51de4 (initial push)
      </AdminAuthProvider>
    </AuthProvider>
  </Router>
);