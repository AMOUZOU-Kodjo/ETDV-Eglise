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



const App = () => {
 
  return (

    <BrowserRouter>
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/dashboard" element={<CommunityDashboard />} /> */}
        <Route path="/dashboardadmin" element={<AdminDashboard />} />
        <Route path="/galleryadmin" element={<AdminGallery />} />
        <Route path ="/dashadmin" element = {<DashAdmin />  } />
        <Route path="/inscription" element = {<Inscription /> }/> 
      </Routes>
      
    </BrowserRouter>
  );
};

export default App;