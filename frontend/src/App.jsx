import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import About from "./components/About";
import Events from "./components/Events";
import Programs from "./components/Programs";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Admin from "./components/Dashboad/Admin";
import Footer from "./components/Footer";
import CommunityDashboard from "./components/Dashboad/CommunityDashboard";
import AdminDashboard from "./components/Dashboad/AdminDashboard";
import AdminGallery from "./components/Dashboad/AdminGallery";
import DashAdmin from "./components/Dashboad/DashAdmin"
import Inscription from "./components/connexion/Inscription";
import MentionsLegales from "./components/Legal/MentionsLegales";
import PolitiqueConfidentialite from "./components/Legal/PolitiqueConfidentialite";
import Support from "./components/Legal/Support";


// Layout pour les pages publiques
const PublicLayout = ({ children }) => (
  <>
    <NavBar />
    <main className="pt-20 min-h-screen">
      {children}
    </main>
    <Footer />
  </>
);

// Layout pour les pages d'administration
const AdminLayout = ({ children }) => (
  <main className="min-h-screen bg-gray-100">
    {children}
  </main>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques avec NavBar et Footer */}
        <Route path="/" element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        } />
        <Route path="/about" element={
          <PublicLayout>
            <About />
          </PublicLayout>
        } />
        <Route path="/events" element={
          <PublicLayout>
            <Events />
          </PublicLayout>
        } />
        <Route path="/programs" element={
          <PublicLayout>
            <Programs />
          </PublicLayout>
        } />
        <Route path="/gallery" element={
          <PublicLayout>
            <Gallery />
          </PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        } />
        
        {/* Routes d'inscription sans footer peut-être */}
        <Route path="/inscription" element={
          <main className="min-h-screen">
            <Inscription />
          </main>
        } />
        
        {/* Routes admin sans navbar publique */}
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
        <Route path="/galleryadmin" element={
          <AdminLayout>
            <AdminGallery />
          </AdminLayout>
        } />
        <Route path="/dashadmin" element={
          <AdminLayout>
            <DashAdmin />
          </AdminLayout>
        } />
       
      </Routes>
    </BrowserRouter>
  );
};

export default App;