import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Image, 
  Video, 
  Music, 
  Download, 
  X,
  Link as LinkIcon,
  Calendar,
  Eye,
  Loader,
  ChevronLeft,
  ChevronRight,
  Globe,
  Youtube,
  Headphones
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import NavBarAdmin from "./NavBarAdmin";

const AdminGallery = () => {
  const [activeTab, setActiveTab] = useState("photos");
  const [mediaItems, setMediaItems] = useState({
    photos: [],
    videos: [],
    audios: []
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    titre: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    url: "",
    type: "" // youtube, vimeo, direct, soundcloud, etc.
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalDownloads: 0,
    recent: 0
  });

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedMedia = localStorage.getItem("galleryMedia");
    if (savedMedia) {
      const parsed = JSON.parse(savedMedia);
      setMediaItems(parsed);
      calculateStats(parsed);
    } else {
      // Données de démonstration
      const demoTab = {
        photos: [
          {
            id: 1,
            titre: "Culte du Dimanche",
            description: "Moment de louange",
            url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
            date: "2024-03-10",
            telechargements: 45,
            vues: 234
          },
          {
            id: 2,
            titre: "Groupe de Jeunes",
            description: "Rencontre hebdomadaire",
            url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
            date: "2024-03-08",
            telechargements: 32,
            vues: 189
          }
        ],
        videos: [
          {
            id: 3,
            titre: "Message du Pasteur",
            description: "Enseignement sur la foi",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            type: "youtube",
            date: "2024-03-12",
            telechargements: 23,
            vues: 567
          },
          {
            id: 4,
            titre: "Louange et Adoration",
            description: "Moment de louange",
            url: "https://player.vimeo.com/video/76979871",
            type: "vimeo",
            date: "2024-03-09",
            telechargements: 34,
            vues: 432
          }
        ],
        audios: [
          {
            id: 5,
            titre: "Enseignement sur la Prière",
            description: "Comment prier efficacement",
           url: "https://archive.org/download/sermon-20240314/sermon.mp3",
            type: "audio",
            date: "2024-03-11",
            telechargements: 56,
            vues: 345
          },
          {
            id: 6,
            titre: "Cantique de Louange",
            description: "Chant d'adoration",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            type: "audio",
            date: "2024-03-07",
            telechargements: 43,
            vues: 234
          }
        ]
      };
      setMediaItems(demoTab);
      calculateStats(demoTab);
      localStorage.setItem("galleryMedia", JSON.stringify(demoTab));
    }
  }, []);

  // Calculer les statistiques
  const calculateStats = (media) => {
    const total = media.photos.length + media.videos.length + media.audios.length;
    const totalDownloads = [...media.photos, ...media.videos, ...media.audios]
      .reduce((sum, item) => sum + (item.telechargements || 0), 0);
    
    const now = new Date();
    const recent = [...media.photos, ...media.videos, ...media.audios]
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === now.getMonth() && 
               itemDate.getFullYear() === now.getFullYear();
      }).length;

    setStats({ total, totalDownloads, recent });
  };

  // Sauvegarder les données
  const saveMedia = (newMedia) => {
    localStorage.setItem("galleryMedia", JSON.stringify(newMedia));
    setMediaItems(newMedia);
    calculateStats(newMedia);
    toast.success("Galerie mise à jour avec succès !");
  };

  // Valider une URL
  const validateUrl = (url, type) => {
    if (!url) return false;
    
    try {
      new URL(url);
      
      if (type === "videos") {
        // Détecter le type de vidéo
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          return "youtube";
        } else if (url.includes("vimeo.com")) {
          return "vimeo";
        } else if (url.includes("dailymotion.com")) {
          return "dailymotion";
        }
        return "direct"; // Vidéo directe .mp4 etc.
      }
      
      if (type === "audios") {
        if (url.includes("soundcloud.com")) {
          return "soundcloud";
        }
        return "audio"; // Audio direct .mp3 etc.
      }
      
      return true;
    } catch {
      return false;
    }
  };

  // Obtenir l'URL d'embed pour YouTube/Vimeo
  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  // Ajouter un média
  const handleAddMedia = () => {
    if (!newItem.titre || !newItem.url) {
      toast.error("Veuillez remplir le titre et l'URL");
      return;
    }

    const validation = validateUrl(newItem.url, activeTab);
    if (!validation) {
      toast.error(`URL ${activeTab === "videos" ? "vidéo" : "audio"} invalide`);
      return;
    }

    setLoading(true);
    try {
      const newMedia = { ...mediaItems };
      const itemWithId = {
        id: Date.now(),
        titre: newItem.titre,
        description: newItem.description || "",
        url: activeTab === "videos" && typeof validation === "string" && validation !== "direct" 
          ? getEmbedUrl(newItem.url) 
          : newItem.url,
        originalUrl: newItem.url,
        type: validation,
        date: newItem.date,
        telechargements: 0,
        vues: 0
      };
      
      newMedia[activeTab].push(itemWithId);
      saveMedia(newMedia);
      
      setShowAddForm(false);
      setNewItem({
        titre: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        url: "",
        type: ""
      });
      
      toast.success("Média ajouté avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Modifier un média
  const handleEditMedia = () => {
    if (!editingItem.titre) {
      toast.error("Le titre est obligatoire");
      return;
    }

    if (editingItem.url) {
      const validation = validateUrl(editingItem.url, activeTab);
      if (!validation) {
        toast.error(`URL ${activeTab === "videos" ? "vidéo" : "audio"} invalide`);
        return;
      }
    }

    setLoading(true);
    try {
      const newMedia = { ...mediaItems };
      const index = newMedia[activeTab].findIndex(item => item.id === editingItem.id);
      
      if (index !== -1) {
        newMedia[activeTab][index] = editingItem;
        saveMedia(newMedia);
        setEditingItem(null);
        toast.success("Média modifié avec succès !");
      }
    } catch (error) {
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un média
  const handleDeleteMedia = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      const newMedia = { ...mediaItems };
      newMedia[activeTab] = newMedia[activeTab].filter(item => item.id !== id);
      saveMedia(newMedia);
      toast.success("Média supprimé !");
    }
  };

  // Suppression multiple
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast.error("Aucun élément sélectionné");
      return;
    }

    if (window.confirm(`Supprimer ${selectedItems.length} élément(s) ?`)) {
      const newMedia = { ...mediaItems };
      newMedia[activeTab] = newMedia[activeTab].filter(item => !selectedItems.includes(item.id));
      saveMedia(newMedia);
      setSelectedItems([]);
      toast.success(`${selectedItems.length} élément(s) supprimé(s)`);
    }
  };

  // Incrémenter le compteur de téléchargement
  const handleDownload = (item) => {
    if (item.url) {
      window.open(item.url, "_blank");
      
      const newMedia = { ...mediaItems };
      const index = newMedia[activeTab].findIndex(i => i.id === item.id);
      if (index !== -1) {
        newMedia[activeTab][index].telechargements++;
        saveMedia(newMedia);
      }
    }
  };

  // Filtrer les éléments par recherche
  const filteredItems = mediaItems[activeTab].filter(item =>
    item.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Sélectionner/désélectionner tout
  const toggleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(item => item.id));
    }
  };

  const statsCards = [
    { label: "Total médias", value: stats.total, icon: Image, color: "bg-blue-500" },
    { label: "Vues", value: stats.totalDownloads, icon: Eye, color: "bg-green-500" },
    { label: "Ajoutés ce mois", value: stats.recent, icon: Calendar, color: "bg-purple-500" },
    { label: "Dans cet onglet", value: mediaItems[activeTab]?.length || 0, icon: activeTab === "photos" ? Image : activeTab === "videos" ? Video : Music, color: "bg-accent" }
  ];

  return (
    <>
      
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-base-100 p-5 md:px-[5%]">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administration de la Galerie</h1>
            <p className="text-base-content/70">Gérez vos photos, vidéos et audios (URLs uniquement)</p>
          </div>
          
          {/* Statistiques rapides */}
          <div className="flex gap-3">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-base-200 p-3 rounded-lg text-center min-w-[80px]">
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${stat.color} text-white p-1 rounded-full`} />
                  <div className="font-bold text-sm">{stat.value}</div>
                  <div className="text-[10px] text-base-content/50">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Onglets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {["photos", "videos", "audios"].map((tab) => {
            const Icon = tab === "photos" ? Image : tab === "videos" ? Video : Music;
            const isActive = activeTab === tab;
            
            return (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchTerm("");
                  setCurrentPage(1);
                  setSelectedItems([]);
                }}
                className={`btn ${isActive ? "btn-primary" : "btn-outline btn-primary"} flex items-center gap-2`}
              >
                <Icon className="w-5 h-5" />
                <span className="capitalize">{tab}</span>
                <span className="badge badge-sm ml-1">{mediaItems[tab]?.length || 0}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter {activeTab}
            </button>
            
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="btn btn-error flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer ({selectedItems.length})
              </button>
            )}
          </div>

          {/* Recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered pl-4 pr-4 py-2"
            />
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-base-200 p-6 rounded-xl shadow-lg mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-accent" />
                  Ajouter {activeTab} (URL)
                </h2>
                <button onClick={() => setShowAddForm(false)} className="btn btn-ghost btn-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Titre *</label>
                  <input
                    type="text"
                    placeholder="Titre du média"
                    value={newItem.titre}
                    onChange={(e) => setNewItem({...newItem, titre: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">
                    {activeTab === "photos" ? "URL de l'image *" : 
                     activeTab === "videos" ? "URL de la vidéo (YouTube, Vimeo, etc.) *" : 
                     "URL de l'audio *"}
                  </label>
                  <input
                    type="url"
                    placeholder={activeTab === "videos" ? "https://youtube.com/watch?v=..." : "https://..."}
                    value={newItem.url}
                    onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                    className="input input-bordered w-full"
                  />
                  {activeTab === "videos" && (
                    <p className="text-xs text-base-content/50 mt-1">
                      Supporte YouTube, Vimeo, Dailymotion et vidéos directes (.mp4, .webm)
                    </p>
                  )}
                  {activeTab === "audios" && (
                    <p className="text-xs text-base-content/50 mt-1">
                      Supporte SoundCloud et audios directs (.mp3, .wav, .ogg)
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={newItem.date}
                    onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <button
                  onClick={handleAddMedia}
                  disabled={loading}
                  className="btn btn-primary md:col-span-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulaire d'édition */}
        <AnimatePresence>
          {editingItem && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-base-200 p-6 rounded-xl shadow-lg mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Edit className="w-5 h-5 text-accent" />
                  Modifier
                </h2>
                <button onClick={() => setEditingItem(null)} className="btn btn-ghost btn-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Titre *</label>
                  <input
                    type="text"
                    value={editingItem.titre}
                    onChange={(e) => setEditingItem({...editingItem, titre: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <input
                    type="text"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">URL</label>
                  <input
                    type="url"
                    value={editingItem.url}
                    onChange={(e) => setEditingItem({...editingItem, url: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <button
                  onClick={handleEditMedia}
                  disabled={loading}
                  className="btn btn-primary md:col-span-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkbox pour sélection multiple */}
        {currentItems.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={selectedItems.length === currentItems.length && currentItems.length > 0}
              onChange={toggleSelectAll}
            />
            <span className="text-sm">Tout sélectionner</span>
          </div>
        )}

        {/* Liste des médias */}
        {currentItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-base-200 rounded-xl"
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-base-content/50 mb-4">
              Aucun {activeTab} trouvé
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-accent"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un {activeTab}
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className="bg-base-200 rounded-xl shadow-lg overflow-hidden group"
                >
                  {/* Checkbox de sélection */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => {
                        if (selectedItems.includes(item.id)) {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        } else {
                          setSelectedItems([...selectedItems, item.id]);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Aperçu */}
                  <div className="relative h-48 overflow-hidden bg-base-300">
                    {activeTab === "photos" && (
                      <img 
                        src={item.url} 
                        alt={item.titre} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+non+disponible";
                        }}
                      />
                    )}
                    
                    {activeTab === "videos" && (
                      <div className="w-full h-full">
                        {item.type === "youtube" || item.url.includes("youtube") ? (
                          <iframe
                            src={item.url}
                            className="w-full h-full"
                            title={item.titre}
                            allowFullScreen
                          />
                        ) : item.type === "vimeo" || item.url.includes("vimeo") ? (
                          <iframe
                            src={item.url}
                            className="w-full h-full"
                            title={item.titre}
                            allowFullScreen
                          />
                        ) : (
                          <video 
                            src={item.url} 
                            className="w-full h-full object-cover" 
                            controls
                          />
                        )}
                      </div>
                    )}
                    
                    {activeTab === "audios" && (
                      <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                        <Headphones className="w-16 h-16 text-accent/50" />
                      </div>
                    )}
                    
                    {/* Badge type */}
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {activeTab === "photos" ? (
                        <>📷 Photo</>
                      ) : activeTab === "videos" ? (
                        <>
                          {item.type === "youtube" && <Youtube className="w-3 h-3" />}
                          {item.type === "vimeo" && "Vimeo"}
                          {item.type === "direct" && "🎥 Vidéo"}
                        </>
                      ) : (
                        <>🎵 Audio</>
                      )}
                    </div>
                  </div>
                  
                  {/* Informations */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{item.titre}</h3>
                    <p className="text-sm text-base-content/70 mb-2 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-base-content/50 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.vues || 0}
                      </span>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(item)}
                        className="btn btn-sm btn-primary"
                        title="Ouvrir dans un nouvel onglet"
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="btn btn-sm btn-warning"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="btn btn-sm btn-error"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-sm ${
                          currentPage === page ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={i} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminGallery;