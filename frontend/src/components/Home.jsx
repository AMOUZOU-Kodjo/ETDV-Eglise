import React from "react";
import { FaFacebook, FaWhatsapp, FaTwitter, FaYoutube } from "react-icons/fa";
import monImage from "../assets/logo.jpg";
import Footer from "./Footer";
import Title from "./Title";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
const socialLinks = [
  {
    icon: <FaFacebook />,
    url: "https://www.facebook.com/profile.php?id=61564484227797",
  },
  {
    icon: <FaWhatsapp />,
    url: "https://wa.me/228910387",
  },
  {
    icon: <FaTwitter />,
    url: "#",
  },
  {
    icon: <FaYoutube />,
    url: "https://www.youtube.com/@etde815",
  },
];

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="p-5 md:px-[5%]  duration-75 " >
        

        <div className="my-10 md:my-20 text-center">
          <Title title="Bienvenue Au Temple du Dieu Vivant" />
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-10">

          {/* Texte */}
          <div className="md:w-3/4 border-l-4 border-yellow-500 bg-base-200 text-base-content p-8 rounded-2xl shadow-lg">
            <p>
              Nous sommes heureux de vous accueillir sur le site officiel de
              notre communauté chrétienne. Ici, chaque âme est précieuse,
              chaque cœur est une promesse, et chaque visite est une bénédiction.
            </p>

            <p className="my-6 font-bold text-center md:text-left">
              "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous
              donnerai du repos."
              <span className="text-accent"> — Mathieu 11 : 28</span>
            </p>

            <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-6">

              <ul>
                <li>
                  <Link to="/contact" className="btn btn-accent">
                Contactez-nous
              </Link>
                </li>
              </ul>

              {/* Réseaux sociaux */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border text-accent border-accent p-3 text-2xl hover:bg-accent hover:text-white hover:-translate-y-1 transition duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={monImage}
              alt="Logo de l'église"
              className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full shadow-xl  border-4 border-accent"
            />
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default Home;