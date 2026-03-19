import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Pas de {} car export sans default
import { CommunityProvider } from './context/CommunityContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminSettings from './components/Dashboad/AdminSettings';
import UserManagement from './components/Dashboad/UserManagement';
// Components principaux
import NavBar from "./components/NavBar";
import About from "./components/About";
import Events from "./components/Events";
import Programs from "./components/Programs";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Inscription from "./components/connexion/Inscription";

// Pages d'authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Pages légales
import MentionsLegales from "./components/Legal/MentionsLegales";
import PolitiqueConfidentialite from "./components/Legal/PolitiqueConfidentialite";
import Support from "./components/Legal/Support";
import CGU from "./components/Legal/CGU";
import Cookies from "./components/Legal/Cookies";

// ==================== IMPORTS ADMIN ====================
import AdminLayout from "./components/Dashboad/AdminLayout"; 
import Admin from "./components/Dashboad/Admin";
import CommunityDashboard from "./components/Dashboad/CommunityDashboard";
import AdminDashboard from "./components/Dashboad/AdminDashboard";
import AdminGallery from "./components/Dashboad/AdminGallery";
import DashAdmin from "./components/Dashboad/DashAdmin";
import GalleryManager from "./components/Dashboad/GalleryManager";
import EventsManager from "./components/Dashboad/EventsManager";

// ==================== IMPORTS COMMUNAUTÉ ====================
import VisitorList from './components/community/VisitorList';
import VisitPage from './pages/VisitPage';

// Layouts
const PublicLayout = ({ children }) => (
  <>
    <NavBar />
    <main className="pt-20 min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {children}
    </main>
    <Footer />
  </>
);

const LegalLayout = ({ children }) => (
  <>
    <NavBar />
    <main className="min-h-screen pt-20 bg-base-100 text-base-content transition-colors duration-300">
      {children}
    </main>
    <Footer />
  </>
);

const AuthLayout = ({ children }) => (
  <main className="min-h-screen bg-base-100">
    {children}
  </main>
);

const AdminLayoutWithTheme = ({ children }) => (
  <AdminLayout>
    <div className="bg-base-100 text-base-content transition-colors duration-300 min-h-screen">
      {children}
    </div>
  </AdminLayout>
);

const App = () => {
  return (
    <BrowserRouter> {/* BrowserRouter DOIT être le premier */}
      <ThemeProvider>
        <CommunityProvider>
          <AuthProvider> {/* AuthProvider maintenant à l'intérieur du Router */}
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
              <Route path="/programs" element={<PublicLayout><Programs /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/visite" element={<PublicLayout><VisitPage /></PublicLayout>} />

              {/* Routes légales */}
              <Route path="/legal" element={<LegalLayout><MentionsLegales /></LegalLayout>} />
              <Route path="/privacy" element={<LegalLayout><PolitiqueConfidentialite /></LegalLayout>} />
              <Route path="/support" element={<LegalLayout><Support /></LegalLayout>} />
              <Route path="/cgu" element={<LegalLayout><CGU /></LegalLayout>} />
              <Route path="/cookies" element={<LegalLayout><Cookies /></LegalLayout>} />

              {/* Routes d'authentification */}
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
              <Route path="/inscription" element={<PublicLayout><Inscription /></PublicLayout>} />

              {/* Routes admin protégées */}
              <Route path="/galleryadmin" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><AdminGallery /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />
              
              <Route path="/eventsadmin" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><EventsManager /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><Admin /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboardadmin" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><AdminDashboard /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />
              
              <Route path="/dashadmin" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><DashAdmin /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />
              
              <Route path="/old-galleryadmin" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><AdminGallery /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />
              
              <Route path="/community-dashboard" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><CommunityDashboard /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/visiteurs" element={
                <ProtectedRoute>
                  <AdminLayoutWithTheme><VisitorList /></AdminLayoutWithTheme>
                </ProtectedRoute>
              } />

              <Route path="/admin/settings" element={
  <ProtectedRoute>
    <AdminLayoutWithTheme>
      <AdminSettings />
    </AdminLayoutWithTheme>
  </ProtectedRoute>
} />

<Route path="/admin/users" element={
  <ProtectedRoute>
    <AdminLayoutWithTheme>
      <UserManagement />
    </AdminLayoutWithTheme>
  </ProtectedRoute>
} />

              {/* Route 404 */}
              <Route path="*" element={
                <PublicLayout>
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl text-base-content/70 mb-8">Page non trouvée</p>
                    <a href="/" className="btn btn-accent">Retour à l'accueil</a>
                  </div>
                </PublicLayout>
              } />
            </Routes>
          </AuthProvider>
        </CommunityProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;