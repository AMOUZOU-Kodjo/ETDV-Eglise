import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import Title from "./Title";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CommunityDashboard from './Dashboad/CommunityDashboard';

// Constantes pour la configuration
const ABOUT_CONFIG = {
  sections: [
    {
      id: "histoire",
      title: "Notre Histoire",
      icon: "📜",
      content: "Notre église a été fondée en 2000 avec pour mission de servir notre communauté chrétienne. Nous croyons en l'amour de Dieu et en la puissance de la foi pour transformer des vies.",
      color: "border-yellow-500",
      gradient: "from-yellow-500/10 to-transparent"
    },
    {
      id: "mission",
      title: "Notre Mission",
      icon: "✨",
      content: "Notre mission est simple : aimer Dieu, servir notre prochain et faire grandir la foi en Jésus-Christ. Que vous soyez en quête de vérité ou déjà enraciné dans l'amour du Seigneur, vous êtes chez vous.",
      color: "border-blue-500",
      gradient: "from-blue-500/10 to-transparent"
    },
    {
      id: "engagement",
      title: "Notre Engagement",
      icon: "🤝",
      content: "Depuis l'an 2000, nous sommes engagés à servir notre communauté avec amour et dévouement. Nous partageons la parole de Dieu, offrons un refuge spirituel et promouvons l'unié au sein de notre église.",
      color: "border-green-500",
      gradient: "from-green-500/10 to-transparent"
    }
  ],
  stats: [
    { label: "Années d'existence", value: "24+", icon: "⏳" },
    { label: "Membres actifs", value: "500+", icon: "👥" },
    { label: "Projets communautaires", value: "50+", icon: "🤲" }
  ]
};

// Composant pour une carte de section
const SectionCard = memo(({ section, index }) => {
  const animationDelay = useMemo(() => `${index * 0.1}s`, [index]);

  return (
    <div
      className="group relative bg-base-200 border-l-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fadeIn"
      style={{ animationDelay }}
    >
      {/* Dégradé de fond au survol */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        aria-hidden="true"
      />
      
      {/* Contenu */}
      <div className="relative p-8">
        {/* Icône */}
        <div className="text-4xl mb-4 text-center animate-bounce-slow">
          {section.icon}
        </div>
        
        {/* Titre avec ligne décorative */}
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold text-center">
            <span className={`bg-gradient-to-r ${section.color.replace('border', 'from')} to-transparent bg-clip-text text-transparent`}>
              {section.title}
            </span>
          </h2>
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 ${section.color} rounded-full`} />
        </div>

        {/* Contenu */}
        <p className="text-base-content/80 leading-relaxed text-center group-hover:text-base-content transition-colors duration-300">
          {section.content}
        </p>

        {/* Effet de brillance au survol */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 group-hover:animate-shine" />
        </div>
      </div>
    </div>
  );
});

SectionCard.displayName = 'SectionCard';
SectionCard.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    content: PropTypes.string.isRequired,
    color: PropTypes.string,
    gradient: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired
};

// Composant pour les statistiques
const StatsSection = memo(() => (
  <div className="my-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {ABOUT_CONFIG.stats.map((stat, index) => (
      <div
        key={stat.label}
        className="stat bg-base-200 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        <div className="stat-figure text-4xl mb-2">{stat.icon}</div>
        <div className="stat-value text-3xl font-bold text-accent mb-2">
          {stat.value}
        </div>
        <div className="stat-desc text-base-content/60">{stat.label}</div>
      </div>
    ))}
  </div>
));

StatsSection.displayName = 'StatsSection';

// Composant principal About
const About = () => {
  // Données mémorisées pour éviter les recalculs inutiles
  const sections = useMemo(() => ABOUT_CONFIG.sections, []);

  return (
    <>
      <NavBar />
      
      <main className="min-h-screen">
        {/* Hero Section avec parallax */}
        <section className="relative bg-gradient-to-br from-base-200 to-base-300 py-20 overflow-hidden">
          {/* Motif de fond */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                  À Propos de Nous
                </span>
              </h1>
              <p className="text-lg md:text-xl text-base-content/70 leading-relaxed animate-fadeIn animation-delay-200">
                Découvrez notre histoire, notre mission et notre engagement envers la communauté
              </p>
              
              {/* Indicateur de scroll */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-scroll" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section des cartes */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Title 
              title="En savoir plus sur nous" 
              subtitle="Notre foi, notre engagement, notre famille"
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, index) => (
              <SectionCard key={section.id} section={section} index={index} />
            ))}
          </div>
        </section>

        {/* Section des statistiques */}
        <section className="bg-base-200/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Notre Impact en Chiffres
            </h2>
            <StatsSection />
          </div>
        </section>

        {/* Section CommunityDashboard */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Notre Communauté
            </h2>
            <CommunityDashboard />
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="bg-gradient-to-r from-accent to-accent/80 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Rejoignez Notre Communauté
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Venez partager avec nous la joie de la foi et de l'amour du Christ
            </p>
            <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-accent transition-all duration-300">
              Nous rendre visite
            </button>
          </div>
        </section>
      </main>

      
    </>
  );
};

// Ajout des animations CSS dans un style tag
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shine {
  100% {
    left: 200%;
  }
}

@keyframes scroll {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(20px);
    opacity: 0;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

.animate-shine {
  animation: shine 0.8s ease-out;
}

.animate-scroll {
  animation: scroll 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
`;

// Injecter les styles dans le head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default About;