// components/Layout/LegalLayout.jsx
import React from "react";
import { motion } from "framer-motion";
import NavBar from "../NavBar";
import Footer from "../Footer";

const LegalLayout = ({ children, title, subtitle, icon: Icon }) => {
  return (
    <>
      <NavBar />
      
      <main className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <section className="relative bg-linear-to-br from-base-200 via-base-100 to-base-200 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              {Icon && (
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-accent/10 rounded-full">
                    <Icon className="w-12 h-12 text-accent" />
                  </div>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-base-content/70">
                {subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contenu */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {children}
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LegalLayout;