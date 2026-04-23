import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importation de toutes les pages
import Home from './pages/home.jsx';
import Dashboard from './pages/dashboard.jsx';
import Kanban from './pages/kanban.jsx';
import Account from './pages/account.jsx';
import Cgu from './pages/cgu.jsx';
import Rgpd from './pages/rgpd.jsx';
import Legal from './pages/legal.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
      <BrowserRouter>
          <Routes>
            {/* Page d'accueil avec le formulaire de connexion */}
            <Route path="/" element={<Home />} />

            {/* Pages principales de l'application (protégées) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            {/* Ajout du paramètre :id pour la route kanban */}
            <Route path="/kanban/:id" element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            {/* Pages d'information et légales (liens du footer) */}
            <Route path="/cgu" element={<Cgu />} />
            <Route path="/privacy" element={<Rgpd />} />
            <Route path="/mentions-legales" element={<Legal />} />

          </Routes>
      </BrowserRouter>
  );
}

export default App;