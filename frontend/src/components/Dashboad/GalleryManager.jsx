// src/components/Dashboard/GalleryManager.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Video,
  Music,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  Tag,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Loader,
  Upload
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import DataTable from "./DataTable";
import MediaUploader from "./MediaUploader";
import StatsCards from "./StatsCards";

const GalleryManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'add'
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

  const API_URL = "http://localhost:3000/media";

  // Charger les médias
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setMedia(response.data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      toast.error("Impossible de charger la galerie");
      
      // Données de démonstration
      setMedia([
        {
          id: 1,
          type: "image",
          title: "Culte du Dimanche",
          description: "Moment de louange",
          url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3",
          date: "2024-03-10",
          downloads: 45,
          views: 234,
          tags: ["culte", "louange"]
        },
        {
          id: 2,
          type: "video",
          title: "Message du Pasteur",
          description: "Enseignement sur la foi",
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          date: "2024-03-12",
          duration: "45:30",
          downloads: 23,
          views: 567,
          tags: ["message", "enseignement"]
        },
        {
          id: 3,
          type: "audio",
          title: "Enseignement sur la Prière",
          description: "Comment prier efficacement",
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          date: "2024-03-11",
          duration: "28:45",
          downloads: 56,
          views: 345,
          tags: ["priere", "enseignement"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les médias
  const filteredMedia = media.filter(item => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const paginatedMedia = filteredMedia.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistiques
  const stats = {
    total: media.length,
    images: media.filter(m => m.type === "image").length,
    videos: media.filter(m => m.type === "video").length,
    audios: media.filter(m => m.type === "audio").length,
    totalDownloads: media.reduce((sum, m) => sum + (m.downloads || 0), 0),
    totalViews: media.reduce((sum, m) => sum + (m.views || 0), 0)
  };

  // Ajouter un média
  const handleAddMedia = async (newMedia) => {
    try {
      const response = await axios.post(API_URL, newMedia);
      setMedia([...media, response.data]);
      toast.success("Média ajouté avec succès !");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  // Modifier un média
  const handleEditMedia = async (id, updatedMedia) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedMedia);
      setMedia(media.map(m => m.id === id ? response.data : m));
      toast.success("Média mis à jour !");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  // Supprimer un média
  const handleDeleteMedia = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce média ?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMedia(media.filter(m => m.id !== id));
      toast.success("Média supprimé !");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Suppression multiple
  const handleBulkDelete = async () => {
    if (!window.confirm(`Supprimer ${selectedItems.length} élément(s) ?`)) return;
    
    try {
      await Promise.all(selectedItems.map(id => axios.delete(`${API_URL}/${id}`)));
      setMedia(media.filter(m => !selectedItems.includes(m.id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} élément(s) supprimé(s)`);
    } catch (error) {
      toast.error("Erreur lors de la suppression multiple");
    }
  };

  // Colonnes pour le tableau
  const columns = [
    {
      key: "preview",
      label: "Aperçu",
      render: (item) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {item.type === "image" && (
            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
          )}
          {item.type === "video" && (
            <Video className="w-full h-full p-2 text-gray-400" />
          )}
          {item.type === "audio" && (
            <Music className="w-full h-full p-2 text-gray-400" />
          )}
        </div>
      )
    },
    {
      key: "title",
      label: "Titre",
      render: (item) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-500">{item.description?.substring(0, 50)}...</p>
        </div>
      )
    },
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.type === "image" ? "bg-blue-100 text-blue-600" :
          item.type === "video" ? "bg-red-100 text-red-600" :
          "bg-green-100 text-green-600"
        }`}>
          {item.type}
        </span>
      )
    },
    {
      key: "date",
      label: "Date",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
    {
      key: "stats",
      label: "Statistiques",
      render: (item) => (
        <div className="flex gap-3">
          <span title="Vues" className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {item.views || 0}
          </span>
          <span title="Téléchargements" className="flex items-center gap-1">
            <Download className="w-4 h-4" /> {item.downloads || 0}
          </span>
        </div>
      )
    },
    {
      key: "tags",
      label: "Tags",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedMedia(item);
              setModalMode("view");
              setIsModalOpen(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedMedia(item);
              setModalMode("edit");
              setIsModalOpen(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteMedia(item.id)}
            className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Header avec actions */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Gestion de la Galerie</h1>
        
        <div className="flex gap-3">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="btn btn-outline btn-error"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer ({selectedItems.length})
            </button>
          )}
          
          <button
            onClick={() => {
              setSelectedMedia(null);
              setModalMode("add");
              setIsModalOpen(true);
            }}
            className="btn btn-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un média
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">Tous les types</option>
          <option value="image">Images</option>
          <option value="video">Vidéos</option>
          <option value="audio">Audios</option>
        </select>
      </div>

      {/* Tableau des médias */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedMedia}
            selectable
            selectedItems={selectedItems}
            onSelect={setSelectedItems}
            onSelectAll={(allIds) => setSelectedItems(allIds)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === i + 1 ? 'bg-accent text-white' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal d'ajout/édition */}
      <AnimatePresence>
        {isModalOpen && (
          <MediaUploader
            media={selectedMedia}
            mode={modalMode}
            onClose={() => setIsModalOpen(false)}
            onSave={modalMode === "add" ? handleAddMedia : (data) => handleEditMedia(selectedMedia.id, data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryManager;