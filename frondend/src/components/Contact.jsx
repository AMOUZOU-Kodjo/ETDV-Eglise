import React from "react";
import NavBar from "./NavBar";
import ContactForm from "./ContactForm";
import Footer from "./Footer";

const Contact = () => (
  <div className="flex flex-col min-h-screen">
    
    <main className="grow p-6 bg-base-100">
      <h1 className="text-4xl font-bold text-center mb-8">Contactez-nous</h1>
      <ContactForm />
    </main>
    
  </div>
);

export default Contact;