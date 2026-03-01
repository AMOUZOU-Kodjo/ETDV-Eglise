import React from "react";
import Title from "./Title";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CommunityDashboard from './Dashboad/CommunityDashboard';


const sections = [
  {
    title: "Notre Histoire",
    content:
      "Notre église a été fondée en 2000 avec pour mission de servir notre communauté chrétienne. Nous croyons en l'amour de Dieu et en la puissance de la foi pour transformer des vies.",
  },
  {
    title: "Notre Mission",
    content:
      "Notre mission est simple : aimer Dieu, servir notre prochain et faire grandir la foi en Jésus-Christ. Que vous soyez en quête de vérité ou déjà enraciné dans l'amour du Seigneur, vous êtes chez vous.",
  },
  {
    title: "Notre Engagement",
    content:
      "Depuis l'an 2000, nous sommes engagés à servir notre communauté avec amour et dévouement. Nous partageons la parole de Dieu, offrons un refuge spirituel et promouvons l’unité au sein de notre église.",
  },
];

const About = () => {
  return (
    <><NavBar />
    <div className="p-5 md:px-[5%]">
      

      <div className="my-10 md:my-20 text-center">
        <Title title="En savoir plus sur nous" />
      </div>

      {/* Grid des sections */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-base-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
          >
            <h2 className="text-2xl font-bold text-accent mb-4 text-center">
              {section.title}
            </h2>

            <p className="text-base-content leading-relaxed text-center">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="my-20">
        <CommunityDashboard />
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default About;