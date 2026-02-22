import React, { useState } from "react";
import NavBar from "./NavBar";
import Title from "./Title";
import Footer from "./Footer";

const weekPrograms = [
  {
    day: "Lundi",
    time: "De 18H00 - 19H00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste ullam molestias laboriosam atque blanditiis.",
  },
  {
    day: "Mardi",
    time: "De 18H00 - 19H00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    day: "Mercredi",
    time: "De 18H00 - 19H00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    day: "Jeudi",
    time: "De 18H00 - 19H00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    day: "Vendredi",
    time: "De 18H00 - 19H00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    day: "Samedi",
    time: "De 18H00 - 19H00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

const Programs = () => {
  const [activeTab, setActiveTab] = useState('semaine');

  return (
    <div className="p-5 md:px-[5%]">
      <div className="my-10 md:my-20">
        <Title title="Nos Programmes" />
      </div>

      {/* Navigation par onglets */}
      <div className="text-center font-bold mb-10 flex  sm:flex-row gap-5 justify-center">
        <button 
          onClick={() => setActiveTab('semaine')}
          className={`btn ${activeTab === 'semaine' ? 'btn-primary' : 'btn-outline btn-primary'}`}
        >
          Semaine
        </button>
        <button 
          onClick={() => setActiveTab('mensuel')}
          className={`btn ${activeTab === 'mensuel' ? 'btn-primary' : 'btn-outline btn-primary'}`}
        >
          Mensuel
        </button>
        <button 
          onClick={() => setActiveTab('annuel')}
          className={`btn ${activeTab === 'annuel' ? 'btn-primary' : 'btn-outline btn-primary'}`}
        >
          Annuel
        </button>
      </div>

      {/* Contenu de l'onglet Semaine */}
      {activeTab === 'semaine' && (
        <div>
          <h1 className="text-center text-2xl font-bold mb-9">
            Programme de la Semaine
          </h1>

          {/* Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-base-200 p-5 rounded-xl">
            {weekPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-base-100 p-5 rounded-xl shadow-xl hover:scale-105 transition duration-300"
              >
                <h2 className="font-bold text-2xl mb-3 uppercase text-blue-500 text-center">
                  {program.day}
                </h2>

                <p className="text-center font-medium mb-4">
                  <span className="text-accent">{program.time}</span> : Séance des Jeunes
                </p>

                <p className="text-sm text-center">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenu de l'onglet Mensuel */}
      {activeTab === 'mensuel' && (
        <div className="bg-base-100 text-base-content p-5 rounded-xl shadow-2xl mt-16 text-center">
          <h1 className="text-2xl font-bold mb-6">Programme Mensuel</h1>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ajoutez ici vos données mensuelles */}
            <div className="bg-base-200 p-5 rounded-xl">
              <h3 className="font-bold text-xl">Premier Dimanche</h3>
              <p>Culte d'action de grâce</p>
            </div>
            <div className="bg-base-200 p-5 rounded-xl">
              <h3 className="font-bold text-xl">Deuxième Dimanche</h3>
              <p>Enseignement biblique</p>
            </div>
            <div className="bg-base-200 p-5 rounded-xl">
              <h3 className="font-bold text-xl">Troisième Dimanche</h3>
              <p>Louange et adoration</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de l'onglet Annuel */}
      {activeTab === 'annuel' && (
        <div className="bg-base-100 text-base-content p-5 rounded-xl shadow-2xl mt-16 text-center">
          <h1 className="text-2xl font-bold mb-6">Programme Annuel</h1>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ajoutez ici vos données annuelles */}
            <div className="bg-base-200 p-5 rounded-xl">
              <h3 className="font-bold text-xl">Janvier</h3>
              <p>Jeûne et prière</p>
            </div>
            <div className="bg-base-200 p-5 rounded-xl">
              <h3 className="font-bold text-xl">Avril</h3>
              <p>Célébration de Pâques</p>
            </div>
            <div className="bg-base-200 p-5 rounded-xl">
              <h3 className="font-bold text-xl">Décembre</h3>
              <p>Concert de Noël</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;