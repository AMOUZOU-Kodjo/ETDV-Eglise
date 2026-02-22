import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // 🔹 Informations de l'église
  const churchInfo = {
    name: "Église Grâce Divine",
    email: "contact@eglise.com",
    phone: "+228 90 00 00 00",
    address: "Lomé, Togo",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.123456!2d0.914092!3d6.683333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1026bf002690c053%3A0x34ca13adae2ad0f!2sETDV+BANIKOP%C3%89+(Temple+B%C3%A9thel),+Togo!5e0!3m2!1sfr!2stg!4v1690000000000!5m2!1sfr!2stg" // insérer ton URL Google Maps Embed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Envoi en cours...");
    setSuccess(null);

    try {
      const res = await axios.post("http://localhost:5000/contact", { name, email, message });

      if (res.data.success) {
        setStatus("Message envoyé !");
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Erreur lors de l'envoi.");
        setSuccess(false);
      }
    } catch (err) {
      setStatus("Erreur lors de l'envoi.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      {/* 🔹 Informations de contact */}
      <div className="bg-base-200 p-8 rounded-xl shadow-lg flex flex-col justify-between">
        <h2 className="text-3xl font-bold mb-6">{churchInfo.name}</h2>

        <div className="flex items-center mb-4">
          <Mail className="w-6 h-6 mr-3 text-accent" />
          <a href={`mailto:${churchInfo.email}`} className="hover:text-accent">{churchInfo.email}</a>
        </div>

        <div className="flex items-center mb-4">
          <Phone className="w-6 h-6 mr-3 text-accent" />
          <span>{churchInfo.phone}</span>
        </div>

        <div className="flex items-center mb-6">
          <MapPin className="w-6 h-6 mr-3 text-accent" />
          <span>{churchInfo.address}</span>
        </div>

        {/* Carte Google Maps */}
        {churchInfo.mapUrl && (
          <iframe
            src={churchInfo.mapUrl}
            className="w-full h-48 rounded-lg shadow-inner"
            allowFullScreen
            loading="lazy"
            title="Map"
          />
        )}
      </div>

      {/* 🔹 Formulaire Contact */}
      <form onSubmit={handleSubmit} className="bg-base-200 p-8 rounded-xl shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>

        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input input-bordered w-full mb-4"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input input-bordered w-full mb-4"
          required
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="textarea textarea-bordered w-full mb-4"
          rows={5}
          required
        />

        <button
          type="submit"
          className={`btn btn-accent w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>

        {status && (
          <p className={`mt-4 p-2 rounded ${
            success === true ? "bg-green-500 text-white" :
            success === false ? "bg-red-500 text-white" : ""
          }`}>
            {status}
          </p>
        )}
      </form>

    </div>
  );
};

export default ContactForm;