import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import About from "./components/About";
import Events from "./components/Events";
import Programs from "./components/Programs";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Inscription from "./components/connexion/Inscription";

// Import des pages légales
import MentionsLegales from "./components/Legal/MentionsLegales";
import PolitiqueConfidentialite from "./components/Legal/PolitiqueConfidentialite";
import Support from "./components/Legal/Support";
import FAQ from "./components/Legal/faq";
import CGU from "./components/Legal/CGU";
import Cookies from "./components/Legal/Cookies";

// ==================== IMPORTS ADMIN ====================
// Note: Assurez-vous que ces chemins sont corrects
import AdminLayout from "./components/Dashboad/AdminLayout"; 
import Admin from "./components/Dashboad/Admin";
import CommunityDashboard from "./components/Dashboad/CommunityDashboard";
import AdminDashboard from "./components/Dashboad/AdminDashboard";
import AdminGallery from "./components/Dashboad/AdminGallery";
import DashAdmin from "./components/Dashboad/DashAdmin";
import GalleryManager from "./components/Dashboad/GalleryManager";
import EventsManager from "./components/Dashboad/EventsManager";

// Layout pour les pages publiques
const PublicLayout = ({ children }) => (
  <>
    <NavBar />
    <main className="pt-20 min-h-screen">{children}</main>
    <Footer />
  </>
);

// Layout pour les pages légales
const LegalLayout = ({ children }) => (
  <>
    <NavBar />
    <main className="min-h-screen pt-20">{children}</main>
    
  </>
);

// ===== SUPPRIMEZ CE BLOC DE CODE =====
// NE PAS REDÉCLARER AdminLayout car il est déjà importé
/*import FAQ from './components/Legal/FAQ';

const AdminLayout = ({ children }) => (
  <main className="min-h-screen bg-gray-100">{children}</main>
);
*/

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== ROUTES PUBLIQUES ==================== */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/programs" element={<PublicLayout><Programs /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* ==================== ROUTES LÉGALES ==================== */}
        <Route path="/legal" element={<LegalLayout><MentionsLegales /></LegalLayout>} />
        <Route path="/privacy" element={<LegalLayout><PolitiqueConfidentialite /></LegalLayout>} />
        <Route path="/support" element={<LegalLayout><Support /></LegalLayout>} />
        <Route path="/faq" element={<LegalLayout><FAQ /></LegalLayout>} />
        <Route path="/cgu" element={<LegalLayout><CGU /></LegalLayout>} />
        <Route path="/cookies" element={<LegalLayout><Cookies /></LegalLayout>} />

        {/* ==================== ROUTES D'INSCRIPTION ==================== */}
        <Route path="/inscription" element={<Inscription />} />

        {/* ==================== ROUTES ADMIN ==================== */}
        <Route path="/galleryadmin" element={
          <AdminLayout>
            <AdminGallery />
          </AdminLayout>
        } />
        
        <Route path="/eventsadmin" element={
          <AdminLayout>
            <EventsManager />
          </AdminLayout>
        } />
        
        <Route path="/admin" element={
          <AdminLayout>
            <Admin />
          </AdminLayout>
        } />
        
        <Route path="/dashboardadmin" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        
        <Route path="/dashadmin" element={
          <AdminLayout>
            <DashAdmin />
          </AdminLayout>
        } />
        
        <Route path="/old-galleryadmin" element={
          <AdminLayout>
            <AdminGallery />
          </AdminLayout>
        } />
        
        <Route path="/community-dashboard" element={
          <AdminLayout>
            <CommunityDashboard />
          </AdminLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;