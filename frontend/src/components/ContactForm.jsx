import React, { useState, useCallback, useMemo } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";

// Constantes de configuration
// Pour Vercel, on utilise l'URL relative car l'API est sur le même domaine
const API_ENDPOINT = "/api/contact"; // Changé de localhost:5000 à /api/contact

const CHURCH_INFO = {
  name: "Église Temple du Dieu Vivant",
  email: "contact@eglise.com",
  phone: "+228 90 00 00 00",
  address: "Lomé, Togo",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.123456!2d0.914092!3d6.683333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1026bf002690c053%3A0x34ca13adae2ad0f!2sETDV+BANIKOP%C3%89+(Temple+B%C3%A9thel),+Togo!5e0!3m2!1sfr!2stg!4v1690000000000!5m2!1sfr!2stg"
};

// État initial du formulaire
const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  message: ""
};

const ContactForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  // Validation des champs
  const validateForm = useCallback(() => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push("Le nom est requis");
    if (!formData.email.trim()) errors.push("L'email est requis");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Format d'email invalide");
    }
    if (!formData.message.trim()) errors.push("Le message est requis");
    
    return errors;
  }, [formData]);

  // Gestionnaire de changement
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status.message) setStatus({ type: null, message: "" });
  }, [status.message]);

  // Réinitialisation du formulaire
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setStatus({ 
        type: "error", 
        message: errors.join(". ") 
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "info", message: "Envoi en cours..." });

    try {
      // Utilisation de fetch au lieu d'axios (plus léger)
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({ 
          type: "success", 
          message: "Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais." 
        });
        resetForm();
      } else {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur de soumission:", error);
      
      let errorMessage = "Une erreur est survenue. Veuillez réessayer.";
      if (!navigator.onLine) {
        errorMessage = "Pas de connexion internet. Vérifiez votre réseau.";
      } else if (error.message === "Failed to fetch") {
        errorMessage = "Impossible de joindre le serveur. Veuillez réessayer plus tard.";
      }
      
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Mémorisation des informations de l'église
  const churchInfo = useMemo(() => CHURCH_INFO, []);

  // Composant de statut
  const StatusMessage = useMemo(() => {
    if (!status.message) return null;

    const statusConfig = {
      success: { icon: CheckCircle, bgColor: "bg-green-500", textColor: "text-white" },
      error: { icon: AlertCircle, bgColor: "bg-red-500", textColor: "text-white" },
      info: { icon: Loader, bgColor: "bg-blue-500", textColor: "text-white" }
    };

    const config = statusConfig[status.type] || statusConfig.info;
    const Icon = config.icon;

    return (
      <div className={`${config.bgColor} ${config.textColor} p-4 rounded-lg flex items-start space-x-3 animate-slideIn`}>
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${status.type === "info" ? "animate-spin" : ""}`} />
        <p className="text-sm font-medium">{status.message}</p>
      </div>
    );
  }, [status]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="text-lg text-base-content/70">
          Nous sommes là pour répondre à vos questions et prier avec vous
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Informations de contact */}
        <div className="bg-base-200 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-accent">{churchInfo.name}</h2>
            
            <div className="space-y-4">
              <ContactInfo 
                icon={Mail} 
                href={`mailto:${churchInfo.email}`}
                text={churchInfo.email}
                label="Email"
              />
              
              <ContactInfo 
                icon={Phone} 
                href={`tel:${churchInfo.phone}`}
                text={churchInfo.phone}
                label="Téléphone"
              />
              
              <ContactInfo 
                icon={MapPin} 
                text={churchInfo.address}
                label="Adresse"
              />
            </div>
          </div>

          {/* Carte Google Maps */}
          {churchInfo.mapUrl && (
            <div className="h-64 w-full">
              <iframe
                src={churchInfo.mapUrl}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                title="Localisation de l'église"
              />
            </div>
          )}
        </div>

        {/* Formulaire de contact */}
        <div className="bg-base-200 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-accent">Envoyez-nous un message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Nom complet"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
              disabled={loading}
            />

            <FormField
              label="Adresse email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />

            <FormField
              label="Message"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message..."
              rows={5}
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent w-full group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </span>
            </button>

            {StatusMessage}
          </form>
        </div>
      </div>
    </section>
  );
};

// Composant pour les champs de formulaire
const FormField = ({ label, name, type, value, onChange, placeholder, rows, required, disabled }) => {
  const baseClassName = "w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-base-content/80">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          className={`${baseClassName} resize-none min-h-30`}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={baseClassName}
        />
      )}
    </div>
  );
};

// Composant pour les informations de contact
const ContactInfo = ({ icon: Icon, href, text, label }) => {
  const content = (
    <div className="flex items-start space-x-3 group">
      <div className="shrink-0">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-base-content/60">{label}</p>
        {href ? (
          <a 
            href={href} 
            className="text-base-content hover:text-accent transition-colors font-medium"
          >
            {text}
          </a>
        ) : (
          <p className="text-base-content font-medium">{text}</p>
        )}
      </div>
    </div>
  );

  return content;
};

const styles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
`;

export default ContactForm;