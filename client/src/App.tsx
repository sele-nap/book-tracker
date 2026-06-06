import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { ApiError } from './api/client.js';
import RequireAuth from './components/RequireAuth.js';
import { ToastProvider } from './components/Toaster.js';
import { AuthProvider } from './contexts/auth.js';
import { LanguageProvider } from './i18n/LanguageContext.js';
import RootLayout from './layouts/RootLayout.js';
import Auth from './pages/Auth.js';
import BookDetail from './pages/BookDetail.js';
import Challenges from './pages/Challenges.js';
import Library from './pages/Library.js';
import Reading from './pages/Reading.js';
import Settings from './pages/Settings.js';
import Shelves from './pages/Shelves.js';
import Stats from './pages/Stats.js';
import Timeline from './pages/Timeline.js';

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <SWRConfig
              value={{
                onError: (err) => {
                  if (
                    err instanceof ApiError &&
                    err.status === 401 &&
                    window.location.pathname !== '/login'
                  ) {
                    window.location.href = '/login';
                  }
                },
              }}
            >
              <Routes>
                <Route path="/login" element={<Auth />} />
                <Route element={<RequireAuth />}>
                  <Route element={<RootLayout />}>
                    <Route index element={<Library />} />
                    <Route path="books/:id" element={<BookDetail />} />
                    <Route path="reading" element={<Reading />} />
                    <Route path="shelves" element={<Shelves />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="challenges" element={<Challenges />} />
                    <Route path="timeline" element={<Timeline />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>
              </Routes>
            </SWRConfig>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
