import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import RootLayout from './layouts/RootLayout';
import BookDetail from './pages/BookDetail';
import Challenges from './pages/Challenges';
import Library from './pages/Library';
import Reading from './pages/Reading';
import Shelves from './pages/Shelves';
import Stats from './pages/Stats';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Library />} />
            <Route path="books/:id" element={<BookDetail />} />
            <Route path="reading" element={<Reading />} />
            <Route path="shelves" element={<Shelves />} />
            <Route path="stats" element={<Stats />} />
            <Route path="challenges" element={<Challenges />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
