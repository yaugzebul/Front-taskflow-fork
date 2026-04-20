import { Routes, Route } from 'react-router-dom';

// Importation de toutes les pages
import Home from './pages/home.jsx';
import Dashboard from './pages/dashboard.jsx';
import Kanban from './pages/kanban.jsx';
import Account from './pages/account.jsx';
import Cgu from './pages/cgu.jsx';
import Rgpd from './pages/rgpd.jsx';
import Legal from './pages/legal.jsx';

function App() {
  return (
      <Routes>
        {/* Page d'accueil avec le formulaire de connexion */}
        <Route path="/" element={<Home />} />

        {/* Pages principales de l'application */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/account" element={<Account />} />

        {/* Pages d'information et légales (liens du footer) */}
        <Route path="/cgu" element={<Cgu />} />
        <Route path="/privacy" element={<Rgpd />} />
        <Route path="/mentions-legales" element={<Legal />} />

      </Routes>
  );
}

export default App;