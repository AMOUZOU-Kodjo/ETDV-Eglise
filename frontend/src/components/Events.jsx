import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { jsPDF } from "jspdf";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Share2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Loader,
  MessageCircle,
  Newspaper,
  BookOpen,
  AlertCircle,
  Heart,
  DownloadCloud,
  Printer
} from "lucide-react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Title from "./Title";

// ==================== CONFIGURATION ====================
const EVENTS_CONFIG = {
  API_URL: "http://localhost:3000/posts",
  postsPerPage: 6,
  filterOptions: [
    { value: "all", label: "Tous", icon: Filter, color: "accent" },
    { value: "message", label: "Messages", icon: MessageCircle, color: "blue" },
    { value: "news", label: "Nouvelles", icon: Newspaper, color: "green" },
    { value: "verse", label: "Versets", icon: BookOpen, color: "purple" }
  ],
  animationVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};

// ==================== COMPOSANT CARD ====================
const EventCard = ({ post, onView, onExport, index }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'message': return MessageCircle;
      case 'news': return Newspaper;
      case 'verse': return BookOpen;
      default: return Calendar;
    }
  };

  const TypeIcon = getTypeIcon(post.type);
  
  const getTypeColor = (type) => {
    switch(type) {
      case 'message': return 'from-blue-500 to-cyan-500';
      case 'news': return 'from-green-500 to-emerald-500';
      case 'verse': return 'from-purple-500 to-pink-500';
      default: return 'from-accent to-accent/80';
    }
  };

  return (
    <motion.div
      variants={EVENTS_CONFIG.animationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-base-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={() => onView(post)}
    >
      {/* Bande de couleur */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getTypeColor(post.type)}`} />

      <div className="p-6">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${getTypeColor(post.type)} bg-opacity-10`}>
            <TypeIcon className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r" style={{
              backgroundImage: `linear-gradient(to right, ${getTypeColor(post.type).split(' ')[1]}, ${getTypeColor(post.type).split(' ')[3]})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }} />
          </div>

          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
            ${post.type === 'message' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
              post.type === 'news' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
              'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
            {post.type}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
          {post.title}
        </h3>

        {/* Contenu */}
        <p className="text-base-content/70 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.content}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center gap-4 text-xs text-base-content/50 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(post.date || Date.now()).toLocaleDateString('fr-FR')}</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{post.author}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-base-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(post);
            }}
            className="flex items-center gap-2 text-accent hover:gap-3 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Lire plus</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport(post);
            }}
            className="flex items-center gap-2 text-base-content/50 hover:text-accent transition-colors"
            title="Télécharger PDF"
          >
            <DownloadCloud className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 group-hover:animate-shine" />
      </div>
    </motion.div>
  );
};

// ==================== COMPOSANT MODAL ====================
const EventModal = ({ post, isOpen, onClose, onExport }) => {
  if (!post) return null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href
        });
        toast.success('Partagé avec succès !');
      } else {
        await navigator.clipboard.writeText(`${post.title}\n\n${post.content}`);
        toast.success('Copié dans le presse-papiers !');
      }
    } catch (error) {
      toast.error('Erreur lors du partage');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center p-4">
              <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl relative">
                {/* Bouton fermer */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-base-200 hover:bg-base-300 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Contenu */}
                <div className="p-8">
                  {/* En-tête */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r 
                      ${post.type === 'message' ? 'from-blue-500 to-cyan-500' :
                        post.type === 'news' ? 'from-green-500 to-emerald-500' :
                        'from-purple-500 to-pink-500'} bg-opacity-10`}>
                      {post.type === 'message' ? <MessageCircle className="w-6 h-6 text-blue-500" /> :
                       post.type === 'news' ? <Newspaper className="w-6 h-6 text-green-500" /> :
                       <BookOpen className="w-6 h-6 text-purple-500" />}
                    </div>
                    <div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize
                        ${post.type === 'message' ? 'bg-blue-100 text-blue-600' :
                          post.type === 'news' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'}`}>
                        {post.type}
                      </span>
                    </div>
                  </div>

                  {/* Titre */}
                  <h2 className="text-3xl font-bold mb-4">{post.title}</h2>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-base-content/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date || Date.now()).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-base-200">
                    <button
                      onClick={() => onExport(post)}
                      className="btn btn-accent flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </button>
                    <button
                      onClick={handleShare}
                      className="btn btn-outline btn-accent flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="btn btn-outline btn-accent"
                      title="Imprimer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== COMPOSANT PAGINATION ====================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-base-200 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`min-w-[40px] h-10 rounded-lg font-medium transition-all
            ${page === currentPage 
              ? 'bg-accent text-white shadow-lg scale-105' 
              : typeof page === 'number' 
                ? 'bg-base-200 hover:bg-base-300' 
                : 'cursor-default'
            }`}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-base-200 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const Events = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chargement des données
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(EVENTS_CONFIG.API_URL);
        setPosts(res.data);
        toast.success('Événements chargés avec succès !', {
          icon: '🎉',
          duration: 3000
        });
      } catch (error) {
        console.error('Erreur de chargement:', error);
        toast.error('Impossible de charger les événements', {
          icon: '❌',
          duration: 4000
        });
        
        // Données de démonstration en cas d'erreur
        setPosts([
          {
            id: 1,
            title: "Culte de Dimanche",
            type: "message",
            content: "Rejoignez-nous pour notre culte dominical avec un message inspirant.",
            author: "Pasteur Jean",
            date: "2024-03-17"
          },
          {
            id: 2,
            title: "Nouveau Groupe de Jeunes",
            type: "news",
            content: "Lancement du nouveau groupe de jeunes ce samedi.",
            author: "Frère Marc",
            date: "2024-03-20"
          },
          {
            id: 3,
            title: "Psaume 23",
            type: "verse",
            content: "L'Éternel est mon berger, je ne manquerai de rien.",
            author: "David",
            date: "2024-03-15"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Filtrage et recherche
  const filteredPosts = useMemo(() => {
    return posts
      .filter(p => filterType === "all" || p.type === filterType)
      .filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase()) ||
        (p.author && p.author.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [posts, filterType, search]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / EVENTS_CONFIG.postsPerPage);
  const currentPosts = useMemo(() => {
    const indexOfLast = currentPage * EVENTS_CONFIG.postsPerPage;
    const indexOfFirst = indexOfLast - EVENTS_CONFIG.postsPerPage;
    return filteredPosts.slice(indexOfFirst, indexOfLast);
  }, [filteredPosts, currentPage]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, search]);

  // Export PDF amélioré
  const exportPDF = useCallback((post) => {
    try {
      const doc = new jsPDF();
      
      // Configuration du document
      doc.setFont("helvetica");
      
      // Titre
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text(post.title, 20, 20);
      
      // Type
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Type: ${post.type}`, 20, 35);
      
      // Date
      if (post.date) {
        doc.text(`Date: ${new Date(post.date).toLocaleDateString('fr-FR')}`, 20, 45);
      }
      
      // Auteur
      if (post.author) {
        doc.text(`Auteur: ${post.author}`, 20, 55);
      }
      
      // Contenu
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      
      const splitContent = doc.splitTextToSize(post.content, 170);
      doc.text(splitContent, 20, 75);
      
      // Pied de page
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Église Temple du Dieu Vivant", 20, 280);
      doc.text(new Date().toLocaleDateString('fr-FR'), 170, 280, { align: 'right' });
      
      // Sauvegarde
      doc.save(`${post.title.replace(/\s+/g, '_')}.pdf`);
      
      toast.success('PDF généré avec succès !', {
        icon: '📄',
        duration: 3000
      });
    } catch (error) {
      console.error('Erreur PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  }, []);

  const handleViewPost = useCallback((post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <NavBar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--b1))',
            color: 'hsl(var(--bc))',
            border: '1px solid hsl(var(--b3))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--ac))',
              secondary: 'white',
            },
          },
        }}
      />

      <main className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Title 
                title="Nos Événements"
                subtitle="Restez informé des dernières nouvelles et messages de notre communauté"
              />
            </motion.div>
          </div>
        </section>

        {/* Section principale */}
        <section className="container mx-auto px-4 py-12">
          {/* Barre de recherche et filtres */}
          <div className="max-w-4xl mx-auto mb-12">
            {/* Recherche */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Rechercher un événement, un message..."
                className="input input-bordered w-full pl-12 py-3 text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap justify-center gap-3">
              {EVENTS_CONFIG.filterOptions.map((option) => {
                const Icon = option.icon;
                const isActive = filterType === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterType(option.value)}
                    className={`
                      relative px-5 py-2.5 rounded-full font-medium transition-all
                      flex items-center gap-2 overflow-hidden
                      ${isActive 
                        ? 'bg-accent text-white shadow-lg' 
                        : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-accent -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* État de chargement */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
              <p className="text-lg text-base-content/50">Chargement des événements...</p>
            </div>
          )}

          {/* Résultats */}
          {!loading && (
            <>
              {/* Compteur de résultats */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-base-content/60">
                  {filteredPosts.length} événement{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="text-sm text-accent hover:underline"
                  >
                    Effacer la recherche
                  </button>
                )}
              </div>

              {/* Grille des événements */}
              <AnimatePresence mode="wait">
                {currentPosts.length > 0 ? (
                  <motion.div
                    key={filterType + search + currentPage}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                      },
                      exit: {
                        opacity: 0,
                        transition: { staggerChildren: 0.05, staggerDirection: -1 }
                      }
                    }}
                    className="grid md:grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {currentPosts.map((post, index) => (
                      <EventCard
                        key={post.id}
                        post={post}
                        index={index}
                        onView={handleViewPost}
                        onExport={exportPDF}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-2xl font-bold mb-2">Aucun événement trouvé</h3>
                    <p className="text-base-content/50 mb-6">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                    <button
                      onClick={() => {
                        setFilterType('all');
                        setSearch('');
                      }}
                      className="btn btn-accent"
                    >
                      Voir tous les événements
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </section>
      </main>

      {/* Modal */}
      <EventModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
        onExport={exportPDF}
      />

  

      {/* Styles globaux */}
      <style>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 0.8s ease-out;
        }
        
        /* Amélioration du scroll */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: hsl(var(--b2));
        }
        
        ::-webkit-scrollbar-thumb {
          background: hsl(var(--a) / 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--a) / 0.5);
        }
      `}</style>
    </>
  );
};

export default Events;