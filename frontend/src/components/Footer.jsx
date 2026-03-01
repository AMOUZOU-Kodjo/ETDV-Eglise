import { useEffect, useState } from "react";
import { FaFacebook, FaWhatsapp, FaTwitter, FaYoutube } from "react-icons/fa";
import monImage from "../assets/logo.jpg";
import axios from "axios";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Programs", path: "/programs" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
  // { name: "Admin", path: "/admin" },
  // { name: "Dashboard", path: "/dashboard" },
  // { name: "AdminDashboard", path: "/dashboardadmin" },
  // { name: "GalleryAdmin", path: "/galleryadmin" }
  
];

const socialLinks = [
  { icon: <FaFacebook />, url: "https://www.facebook.com/profile.php?id=61564484227797" },
  { icon: <FaWhatsapp />, url: "https://wa.me/22891038727" },
  { icon: <FaTwitter />, url: "#" },
  { icon: <FaYoutube />, url: "https://www.youtube.com/@etde815" },
];

const Footer = () => {
   const [media, setMedia] = useState([]);
  const [email, setEmail] = useState("");
  const [type, setType] = useState("abonnee");
  const [editId, setEditId] = useState(null);

 const API_MEDIA = "http://localhost:3000/media";

  const loadMedia = async () => {
    const res = await axios.get(API_MEDIA);
    setMedia(res.data);
  };
  useEffect(() => {
      loadMedia();
    }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email ) return;

    if (editId) {
      await axios.put(`${API_MEDIA}/${editId}`, { email, type });
      setEditId(null);
    } else {
      await axios.post(API_MEDIA, { email, type });
    }

    setEmail(""); setType("abonnee");
    loadPosts();
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios.post('http://localhost:3000/media',e)
  //   alert(`Merci pour votre inscription : ${email}`);
  //   setEmail("");
  // };

  return (
    <footer className="bg-base-200 text-base-content px-6 py-12">
      <div className="grid gap-10 md:grid-cols-4">

        {/* Logo + Infos */}
        <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
          <img
            src={monImage}
            alt="Logo"
            className="w-16 h-16 rounded-full border-2 border-accent shadow-lg 
              hover:scale-105 transition-transform duration-300"
          />
          <p className="text-sm leading-relaxed">
            Eglise Temple du Dieu Vivant <br />
            Tél: +228 91038727 <br />
            Email: etdv@gmail.com <br />
            Depuis 2000
          </p>
        </div>

        {/* Navigation */}
        <div className="justify-center items-center flex flex-col">
          <h6 className="font-bold mb-4 text-accent ">Navigation</h6>
          <ul className="grid grid-cols-2 gap-3 ">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="hover:text-accent transition duration-500 uppercase"
                >
                  {link.name} 
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div className="justify-center items-center flex flex-col">
          <h6 className="font-bold mb-4 text-accent ">Suivez-nous</h6>
          <div className="flex gap-4  ">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-accent text-accent
                  hover:bg-accent hover:text-white hover:-translate-y-1
                  transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="justify-center items-center flex flex-col">
          <h6 className="font-bold mb-4 text-accent">Newsletter</h6>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 rounded-lg text-white focus:outline-none bg-base-300"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-pink-600 text-white py-2 rounded-lg
                transition duration-300 hover:scale-105"
            >
              S'abonner
            </button>
          </form>
        </div>

      </div>

      <div className="text-center text-sm mt-10 border-t border-gray-400 pt-6">
        © {new Date().getFullYear()} <span className="text-accent bold">Temple du Dieu Vivant</span>. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;