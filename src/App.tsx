import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Apps from './pages/Apps';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import OS from './pages/OS';
import Journal from './pages/Journal';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { Toaster } from 'sonner';
import { SmoothScroll } from './components/SmoothScroll';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <BlogProvider>
          <CustomCursor />
          <SmoothScroll>
            <Preloader />
            <Router>
              <Toaster position="top-right" theme="dark" toastOptions={{
                style: {
                  background: 'rgba(10, 10, 10, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  borderRadius: '0px'
                }
              }} />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="work" element={<Work />} />
                  <Route path="services" element={<Services />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="apps" element={<Apps />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="os" element={<OS />} />
                </Route>
              </Routes>
            </Router>
          </SmoothScroll>
        </BlogProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

