import React, { useState, useEffect } from "react";
import { Menu, X, Home, Info, Calendar, BookOpen, Image, Phone, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // Import du hook useTheme

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme(); // Utilisation du contexte de thème

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    }; 

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about", label: "About", icon: Info },
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/programs", label: "Programs", icon: BookOpen },
    { to: "/gallery", label: "Gallery", icon: Image },
    { to: "/contact", label: "Contact", icon: Phone }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-base-200/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-base-200 py-4'
      }
    `}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center font-bold text-xl sm:text-2xl md:text-3xl hover:text-accent transition-colors"
          >
            Eglise<span className="text-accent">ETDV</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-1 md:space-x-2 lg:space-x-4">
            <ul className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.to);
                
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`
                        flex items-center space-x-1 px-3 py-2 text-base md:text-lg rounded-lg 
                        transition-all duration-300 group relative
                        ${isActive 
                          ? 'text-accent bg-accent/10' 
                          : 'hover:bg-accent/10 hover:text-accent'
                        }
                      `}
                    >
                      <Icon className={`
                        w-4 h-4 md:w-5 md:h-5 transition-transform
                        ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                      `} />
                      <span>{link.label}</span>
                      
                      {/* Indicateur de page active */}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-accent rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Bouton de thème pour desktop */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg bg-base-300 hover:bg-base-400 transition-colors"
              aria-label="Changer le thème"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </motion.button>
          </div>

          {/* Mobile - Menu et bouton thème */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Bouton de thème pour mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-base-300 hover:bg-base-400 transition-colors"
              aria-label="Changer le thème"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </motion.button>

            {/* Bouton hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 lg:hidden hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile avec animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <ul className="flex flex-col space-y-2 py-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActiveLink(link.to);
                  
                  return (
                    <motion.li
                      key={link.to}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        to={link.to}
                        className={`
                          flex items-center space-x-3 px-4 py-3 text-lg rounded-lg 
                          transition-colors
                          ${isActive 
                            ? 'text-accent bg-accent/10' 
                            : 'hover:bg-accent/10 hover:text-accent'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;