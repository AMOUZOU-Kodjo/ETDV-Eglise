import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";

const CHURCH_INFO = {
  name: "Église Temple du Dieu Vivant",
  email: "contact@eglise.com",
  phone: "+228 90 00 00 00",
  address: "Lomé, Togo",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.123456!2d0.914092!3d6.683333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1026bf002690c053%3A0x34ca13adae2ad0f!2sETDV+BANIKOP%C3%89+(Temple+B%C3%A9thel),+Togo!5e0!3m2!1sfr!2stg!4v1690000000000!5m2!1sfr!2stg"
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "info", message: "Envoi en cours..." });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: "Message envoyé avec succès !" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Erreur lors de l'envoi" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  const StatusMessage = () => {
    if (!status.message) return null;

    const config = {
      success: { icon: CheckCircle, bgColor: "bg-green-500" },
      error: { icon: AlertCircle, bgColor: "bg-red-500" },
      info: { icon: Loader, bgColor: "bg-blue-500" }
    };

    const { icon: Icon, bgColor } = config[status.type] || config.info;

    return (
      <div className={`${bgColor} text-white p-4 rounded-lg flex items-center space-x-3`}>
        <Icon className={`w-5 h-5 ${status.type === "info" ? "animate-spin" : ""}`} />
        <p>{status.message}</p>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Infos */}
        <div className="bg-base-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-accent">{CHURCH_INFO.name}</h2>
          <div className="space-y-4">
            <ContactInfo icon={Mail} text={CHURCH_INFO.email} label="Email" />
            <ContactInfo icon={Phone} text={CHURCH_INFO.phone} label="Téléphone" />
            <ContactInfo icon={MapPin} text={CHURCH_INFO.address} label="Adresse" />
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-base-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-accent">Envoyez-nous un message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-base-100 rounded-lg"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Votre email"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-base-100 rounded-lg"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message..."
              rows={5}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-base-100 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Envoi...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer
                </span>
              )}
            </button>

            <StatusMessage />
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ icon: Icon, text, label }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div>
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="font-medium">{text}</p>
    </div>
  </div>
);

export default ContactForm;