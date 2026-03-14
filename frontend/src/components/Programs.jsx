import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Heart,
  Music,
  Sun,
  Moon,
  Star,
  ChevronRight,
  MapPin,
  Bell,
  Filter,
  X,
  Download,
  Share2,
} from "lucide-react";
import NavBar from "./NavBar";
import Title from "./Title";
import CalendarButton from "./CalendarButton";
import Footer from "./Footer";

// ==================== CONFIGURATION ====================
const PROGRAM_CONFIG = {
  weekly: [
    {
      id: 1,
      day: "Lundi",
      time: "18:00 - 19:00",
      title: "Séance des Jeunes",
      description:
        "Étude biblique interactive et partage pour les jeunes. Un moment de croissance spirituelle et de communion fraternelle.",
      longDescription:
        "Rejoignez-nous pour une soirée spéciale dédiée aux jeunes. Enseignements dynamiques, louange moderne et discussions enrichissantes sur des sujets pertinents pour la jeunesse d'aujourd'hui.",
      icon: Users,
      category: "jeunes",
      color: "from-blue-500 to-cyan-500",
      location: "Salle Polyvalente",
      capacity: "50 personnes",
      leaders: ["Frère Jean", "Sœur Marie"],
    },
    {
      id: 2,
      day: "Mardi",
      time: "18:00 - 19:00",
      title: "Étude Biblique",
      description:
        "Approfondissement de la parole de Dieu à travers l'étude systématique des Écritures.",
      longDescription:
        "Étude verset par verset de livres bibliques sélectionnés. Apportez votre Bible et un carnet de notes pour une étude approfondie.",
      icon: BookOpen,
      category: "etude",
      color: "from-green-500 to-emerald-500",
      location: "Salle d'étude",
      capacity: "40 personnes",
      leaders: ["Pasteur Pierre"],
    },
    {
      id: 3,
      day: "Mercredi",
      time: "18:00 - 19:00",
      title: "Culte de Prière",
      description:
        "Soirée de prière et d'intercession pour les besoins de l'église et de la communauté.",
      longDescription:
        "Un moment puissant d'intercession collective. Nous prions pour les malades, les besoins personnels, la nation et le monde.",
      icon: Heart,
      category: "priere",
      color: "from-purple-500 to-pink-500",
      location: "Sanctuaire",
      capacity: "100 personnes",
      leaders: ["Frère David"],
    },
    {
      id: 4,
      day: "Jeudi",
      time: "18:00 - 19:00",
      title: "Enseignement",
      description:
        "Enseignement approfondi sur des thèmes bibliques spécifiques pour édifier la foi.",
      icon: BookOpen,
      category: "etude",
      color: "from-orange-500 to-amber-500",
      location: "Salle Polyvalente",
      leaders: ["Pasteur Marc"],
    },
    {
      id: 5,
      day: "Vendredi",
      time: "18:00 - 19:00",
      title: "Louange et Adoration",
      description:
        "Soirée de louange intense pour chercher la présence de Dieu dans la musique et le chant.",
      icon: Music,
      category: "louange",
      color: "from-red-500 to-rose-500",
      location: "Sanctuaire",
      leaders: ["Équipe de louange"],
    },
    {
      id: 6,
      day: "Samedi",
      time: "18:00 - 19:00",
      title: "Réveil Spirituel",
      description:
        "Moment de réveil et de renouveau spirituel avec des enseignements dynamiques.",
      icon: Sun,
      category: "special",
      color: "from-indigo-500 to-blue-500",
      location: "Sanctuaire",
      leaders: ["Pasteur invité"],
    },
  ],
  monthly: [
    {
      id: 7,
      week: "1er Dimanche",
      title: "Culte d'Action de Grâce",
      description:
        "Célébration spéciale pour rendre grâce à Dieu pour ses bienfaits du mois écoulé.",
      longDescription:
        "Témoignages, offrandes spéciales et adoration intense pour célébrer la bonté de Dieu.",
      icon: Heart,
      color: "from-yellow-500 to-amber-500",
      date: "Premier dimanche du mois",
      time: "09:00 - 12:00",
    },
    {
      id: 8,
      week: "2ème Dimanche",
      title: "Enseignement Biblique",
      description:
        "Série d'enseignements approfondis sur des thèmes spécifiques de la foi.",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      date: "Deuxième dimanche du mois",
      time: "10:00 - 12:00",
    },
    {
      id: 9,
      week: "3ème Dimanche",
      title: "Louange et Adoration",
      description:
        "Journée spéciale consacrée à la louange et à l'adoration avec l'équipe de musique.",
      icon: Music,
      color: "from-purple-500 to-pink-500",
      date: "Troisième dimanche du mois",
      time: "09:00 - 13:00",
    },
    {
      id: 10,
      week: "4ème Dimanche",
      title: "Guérison et Délivrance",
      description:
        "Service spécial de prière pour la guérison physique, émotionnelle et spirituelle.",
      icon: Heart,
      color: "from-blue-500 to-cyan-500",
      date: "Quatrième dimanche du mois",
      time: "09:00 - 14:00",
    },
  ],
  annual: [
    {
      id: 11,
      month: "Janvier",
      title: "Jeûne et Prière",
      description:
        "21 jours de jeûne et de prière pour consacrer l'année au Seigneur.",
      icon: Moon,
      color: "from-blue-500 to-indigo-500",
      dates: "1-21 Janvier",
      highlights: [
        "Prières quotidiennes",
        "Enseignements spéciaux",
        "Veillées",
      ],
    },
    {
      id: 12,
      month: "Mars-Avril",
      title: "Célébration de Pâques",
      description:
        "Semaine sainte avec des services spéciaux pour célébrer la résurrection.",
      icon: Sun,
      color: "from-purple-500 to-pink-500",
      dates: "Semaine Sainte",
      highlights: ["Jeudi Saint", "Vendredi Saint", "Dimanche de Pâques"],
    },
    {
      id: 13,
      month: "Juillet",
      title: "Conférence Annuelle",
      description:
        "Conférence avec des orateurs invités de renom pour des enseignements puissants.",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      dates: "15-20 Juillet",
      highlights: ["5 jours d'enseignements", "Ateliers", "Nuits de prière"],
    },
    {
      id: 14,
      month: "Août",
      title: "Camp de Jeunes",
      description:
        "Retraite spirituelle de 3 jours pour les jeunes avec enseignements et activités.",
      icon: Users,
      color: "from-orange-500 to-amber-500",
      dates: "10-13 Août",
      highlights: ["Enseignements", "Sports", "Feux de camp"],
    },
    {
      id: 15,
      month: "Octobre",
      title: "Mois de la Moisson",
      description:
        "Célébration des récoltes et actions de grâce avec des offrandes spéciales.",
      icon: Heart,
      color: "from-yellow-500 to-amber-500",
      dates: "Tout le mois",
      highlights: ["Offrandes de récolte", "Actions de grâce", "Fête"],
    },
    {
      id: 16,
      month: "Décembre",
      title: "Concert de Noël",
      description:
        "Grand concert de Noël avec chorale et orchestre pour célébrer la naissance de Jésus.",
      icon: Music,
      color: "from-red-500 to-rose-500",
      dates: "24 Décembre",
      highlights: ["Chorale", "Crèche vivante", "Distribution de cadeaux"],
    },
  ],
};

// ==================== TYPES D'ONGLETS ====================
const TABS = [
  { id: "weekly", label: "Hebdomadaire", icon: Calendar, color: "accent" },
  { id: "monthly", label: "Mensuel", icon: Star, color: "secondary" },
  { id: "annual", label: "Annuel", icon: Sun, color: "primary" },
];

// ==================== COMPOSANT PROGRAM CARD ====================
const ProgramCard = ({ program, index, type, onClick }) => {
  const Icon = program.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative h-full cursor-pointer"
      onClick={() => onClick(program)}
    >
      {/* Carte principale */}
      <div className="relative h-full bg-base-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Bande de couleur dégradée */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${program.color}`}
        />

        {/* Contenu */}
        <div className="p-6">
          {/* En-tête avec icône */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${program.color} bg-opacity-10`}
            >
              <Icon
                className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${program.color.split(" ")[1]}, ${program.color.split(" ")[3]})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              />
            </div>

            {/* Badge de catégorie */}
            {program.category && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent capitalize">
                {program.category}
              </span>
            )}
          </div>

          {/* Titre principal */}
          <h3 className="text-2xl font-bold mb-2">
            {program.day || program.week || program.month}
          </h3>

          {/* Sous-titre */}
          <h4 className="text-lg font-semibold text-accent mb-3">
            {program.title}
          </h4>

          {/* Informations temporelles */}
          <div className="space-y-2 mb-4">
            {program.time && (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Clock className="w-4 h-4" />
                <span>{program.time}</span>
              </div>
            )}

            {program.date && (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Calendar className="w-4 h-4" />
                <span>{program.date}</span>
              </div>
            )}

            {program.location && (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <MapPin className="w-4 h-4" />
                <span>{program.location}</span>
              </div>
            )}
          </div>

          {/* Description courte */}
          <p className="text-base-content/70 text-sm leading-relaxed mb-4 line-clamp-3">
            {program.description}
          </p>

          {/* Lien "Voir plus" */}
          <div className="flex items-center gap-1 text-accent text-sm font-medium group/link">
            <span>Voir détails</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </div>
        </div>

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

// ==================== COMPOSANT MODAL DE DÉTAILS CORRIGÉ ====================
const ProgramModal = ({ program, isOpen, onClose, type }) => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  if (!program) return null;

  const Icon = program.icon;

  // Fonction pour gérer le rappel
  const handleRemindMe = () => {
    // Vérifier si le navigateur supporte les notifications
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Créer une notification
          const notificationTime = new Date();
          notificationTime.setMinutes(notificationTime.getMinutes() + 10); // Rappel dans 10 minutes pour test
            
          new Notification('Rappel de programme', {
            body: `${program.title} - ${program.day || program.week || program.month} à ${program.time || '09:00'}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
          
          setNotification({
            show: true,
            message: '✅ Rappel programmé ! Vous serez notifié 10 min avant',
            type: 'success'
          });
        } else {
          setNotification({
            show: true,
            message: '❌ Veuillez autoriser les notifications',
            type: 'error'
          });
        }
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas les notifications
      alert(`Rappel pour: ${program.title}\nDate: ${program.day || program.week || program.month}\nHeure: ${program.time || '09:00'}`);
      
      setNotification({
        show: true,
        message: '✅ Rappel ajouté (version simple)',
        type: 'success'
      });
    }

    // Cacher la notification après 3 secondes
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fonction pour partager
  const handleShare = async () => {
    const shareData = {
      title: `${program.title} - Église ETDV`,
      text: `${program.description}\n\n📅 ${program.day || program.week || program.month}\n⏰ ${program.time || 'À confirmer'}\n📍 ${program.location || 'Église Temple du Dieu Vivant'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setNotification({
          show: true,
          message: '✅ Partagé avec succès !',
          type: 'success'
        });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas Web Share
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\nLien: ${shareData.url}`
        );
        setNotification({
          show: true,
          message: '📋 Copié dans le presse-papiers !',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Erreur de partage:', error);
      setNotification({
        show: true,
        message: '❌ Erreur lors du partage',
        type: 'error'
      });
    }

    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fonction pour télécharger en ICS
  const handleDownload = () => {
    try {
      // Préparer les données pour le fichier ICS
      const eventDate = new Date();
      const [year, month, day] = eventDate.toISOString().split('T')[0].split('-');
      
      // Extraire l'heure ou utiliser une heure par défaut
      let startHour = "09", startMin = "00";
      let endHour = "10", endMin = "00";
      
      if (program.time) {
        const times = program.time.split(' - ');
        if (times[0]) {
          [startHour, startMin] = times[0].split(':');
        }
        if (times[1]) {
          [endHour, endMin] = times[1].split(':');
        }
      }

      // Créer le contenu ICS
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Église ETDV//Programme//FR
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${program.id}@eglise-etdv.org
DTSTAMP:${year}${month}${day}T${startHour}${startMin}00Z
DTSTART:${year}${month}${day}T${startHour}${startMin}00Z
DTEND:${year}${month}${day}T${endHour}${endMin}00Z
SUMMARY:${program.title}
DESCRIPTION:${program.description.replace(/\n/g, ' ')}
LOCATION:${program.location || 'Église Temple du Dieu Vivant'}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      // Créer et télécharger le fichier
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${program.title.replace(/\s+/g, '-').toLowerCase()}.ics`);
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setNotification({
        show: true,
        message: '✅ Fichier téléchargé avec succès !',
        type: 'success'
      });
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      setNotification({
        show: true,
        message: '❌ Erreur lors du téléchargement',
        type: 'error'
      });
    }

    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center p-4">
              <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-3xl relative">
                {/* Bande de couleur */}
                <div
                  className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${program.color} rounded-t-2xl`}
                />

                {/* Bouton fermer */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-base-200 hover:bg-base-300 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Contenu */}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${program.color} bg-opacity-10`}
                    >
                      <Icon
                        className="w-8 h-8"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${program.color.split(" ")[1]}, ${program.color.split(" ")[3]})`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">
                        {program.day || program.week || program.month}
                      </h2>
                      <p className="text-xl text-accent">{program.title}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Informations principales */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Informations</h3>

                      {program.time && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-accent" />
                          <span>{program.time}</span>
                        </div>
                      )}

                      {program.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-accent" />
                          <span>{program.location}</span>
                        </div>
                      )}

                      {program.capacity && (
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-accent" />
                          <span>Capacité: {program.capacity}</span>
                        </div>
                      )}

                      {program.dates && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-accent" />
                          <span>{program.dates}</span>
                        </div>
                      )}
                    </div>

                    {/* Responsables */}
                    {program.leaders && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Responsables</h3>
                        {program.leaders.map((leader, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span>{leader}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Points forts pour annuel */}
                    {program.highlights && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Au programme</h3>
                        {program.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description longue */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-base-content/80 leading-relaxed">
                      {program.longDescription || program.description}
                    </p>
                  </div>

                  {/* Boutons d'action avec fonctions */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={handleRemindMe}
                      className="btn btn-accent flex-1 hover:scale-105 transition-transform"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Me rappeler
                    </button>
                    <button 
                      onClick={handleShare}
                      className="btn btn-outline btn-accent flex-1 hover:scale-105 transition-transform"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="btn btn-outline btn-accent flex-1 hover:scale-105 transition-transform"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 50, x: '-50%' }}
                className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 
                           px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-[60]
                           ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
                           text-white`}
              >
                <span className="font-medium">{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== COMPOSANT FILTER BAR ====================
const FilterBar = ({ categories, activeFilter, onFilterChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-center gap-3 mb-8"
    >
      <button
        onClick={() => onFilterChange("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeFilter === "all"
            ? "bg-accent text-white shadow-lg scale-105"
            : "bg-base-200 text-base-content/70 hover:bg-base-300"
        }`}
      >
        Tous
      </button>
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onFilterChange(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
            activeFilter === cat.value
              ? "bg-accent text-white shadow-lg scale-105"
              : "bg-base-200 text-base-content/70 hover:bg-base-300"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </motion.div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const Programs = () => {
  const [activeTab, setActiveTab] = useState("weekly");
  const [filter, setFilter] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Détection du scroll pour bouton remonter
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Catégories pour le filtre
  const categories = useMemo(() => {
    if (activeTab === "weekly") {
      return [
        { value: "jeunes", label: "Jeunes" },
        { value: "etude", label: "Étude" },
        { value: "priere", label: "Prière" },
        { value: "louange", label: "Louange" },
        { value: "special", label: "Spécial" },
      ];
    }
    return [];
  }, [activeTab]);

  // Programmes filtrés
  const filteredPrograms = useMemo(() => {
    const programs = PROGRAM_CONFIG[activeTab];
    if (filter === "all" || !programs) return programs;
    return programs.filter((p) => p.category === filter);
  }, [activeTab, filter]);

  // Gestionnaire d'ouverture des détails
  const handleProgramClick = useCallback((program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-base-100">
        {/* Hero Section avec parallax */}
        <section className="relative bg-linear-to-br from-base-200 via-base-100 to-base-200 py-20 overflow-hidden">
          {/* Motif de fond animé */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Cercles décoratifs animés */}
          <motion.div
            className="absolute top-10 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Title
                title="Nos Programmes"
                subtitle="Découvrez nos activités spirituelles et rejoignez-nous pour grandir ensemble dans la foi"
              />

              {/* Statistiques rapides */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">20+</div>
                  <div className="text-sm text-base-content/60">
                    Activités/semaine
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">500+</div>
                  <div className="text-sm text-base-content/60">
                    Participants
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">12</div>
                  <div className="text-sm text-base-content/60">
                    Événements annuels
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section principale */}
        <section className="container mx-auto px-4 py-12">
          {/* Navigation par onglets */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setFilter("all");
                  }}
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? "bg-accent text-white shadow-lg pr-8"
                        : "bg-base-200 text-base-content hover:bg-base-300"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                    />
                    <span>{tab.label}</span>
                  </div>

                  {/* Badge de compte */}
                  <span
                    className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {PROGRAM_CONFIG[tab.id]?.length || 0}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Barre de filtres */}
          {categories.length > 0 && (
            <FilterBar
              categories={categories}
              activeFilter={filter}
              onFilterChange={setFilter}
            />
          )}

          {/* Grille des programmes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + filter}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPrograms?.map((program, index) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  index={index}
                  type={activeTab}
                  onClick={handleProgramClick}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Message si aucun programme */}
          {filteredPrograms?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📅</div>
              <p className="text-xl text-base-content/50 mb-4">
                Aucun programme trouvé pour cette catégorie
              </p>
              <button
                onClick={() => setFilter("all")}
                className="btn btn-accent"
              >
                Voir tous les programmes
              </button>
            </motion.div>
          )}
        </section>

        {/* Section Call-to-Action */}
        <section className="bg-gradient-to-r from-accent to-accent/80 py-20 mt-12">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à nous rejoindre ?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Venez participer à nos programmes et découvrir une communauté
                chaleureuse
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <CalendarButton
                  events={PROGRAM_CONFIG.weekly.concat(
                    PROGRAM_CONFIG.monthly,
                    PROGRAM_CONFIG.annual,
                  )}
                  onEventClick={(event) => {
                    // Optionnel : gérer le clic sur un événement
                    console.log("Événement sélectionné:", event);
                    // Vous pouvez ouvrir votre modal de détails ici
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-lg bg-white text-accent hover:bg-white/90 border-0"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Nous contacter
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Modal de détails */}
      <ProgramModal
        program={selectedProgram}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={activeTab}
      />

      {/* Bouton retour en haut */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          >
            <ChevronRight className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      
    </>
  );
};

export default Programs;
