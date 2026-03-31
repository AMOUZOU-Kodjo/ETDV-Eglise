// src/components/Dashboard/EventsManager.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Users,
  Tag,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Loader
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import DataTable from "./DataTable";
import StatsCards from "./StatsCards";

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

  const API_URL = "http://localhost:3000/events";

  // Charger les événements
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setEvents(response.data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      toast.error("Impossible de charger les événements");
      
      // Données de démonstration
      setEvents([
        {
          id: 1,
          title: "Culte du Dimanche",
          description: "Culte de louange et d'adoration",
          date: "2024-03-17",
          time: "09:00",
          endTime: "12:00",
          location: "Sanctuaire Principal",
          type: "culte",
          status: "upcoming",
          capacity: 200,
          registered: 145,
          speakers: ["Pasteur Jean"],
          image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3"
        },
        {
          id: 2,
          title: "Groupe de Jeunes",
          description: "Rencontre hebdomadaire des jeunes",
          date: "2024-03-15",
          time: "18:00",
          endTime: "20:00",
          location: "Salle Polyvalente",
          type: "jeunes",
          status: "ongoing",
          capacity: 50,
          registered: 32,
          speakers: ["Frère Marc"]
        },
        {
          id: 3,
          title: "Conférence sur la Famille",
          description: "Enseignement sur les valeurs familiales",
          date: "2024-03-20",
          time: "15:00",
          endTime: "18:00",
          location: "Sanctuaire",
          type: "conference",
          status: "upcoming",
          capacity: 150,
          registered: 89,
          speakers: ["Pasteur Pierre", "Sœur Marie"]
        },
        {
          id: 4,
          title: "Séance de Prière",
          description: "Nuit de prière et d'intercession",
          date: "2024-03-14",
          time: "20:00",
          endTime: "23:00",
          location: "Sanctuaire",
          type: "priere",
          status: "past",
          capacity: 100,
          registered: 67,
          speakers: ["Frère David"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Trier par date
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Pagination
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistiques
  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === "upcoming").length,
    ongoing: events.filter(e => e.status === "ongoing").length,
    past: events.filter(e => e.status === "past").length,
    totalRegistered: events.reduce((sum, e) => sum + (e.registered || 0), 0),
    totalCapacity: events.reduce((sum, e) => sum + (e.capacity || 0), 0)
  };

  // Ajouter un événement
  const handleAddEvent = async (newEvent) => {
    try {
      const response = await axios.post(API_URL, newEvent);
      setEvents([...events, response.data]);
      toast.success("Événement ajouté avec succès !");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  // Modifier un événement
  const handleEditEvent = async (id, updatedEvent) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedEvent);
      setEvents(events.map(e => e.id === id ? response.data : e));
      toast.success("Événement mis à jour !");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  // Supprimer un événement
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEvents(events.filter(e => e.id !== id));
      toast.success("Événement supprimé !");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Suppression multiple
  const handleBulkDelete = async () => {
    if (!window.confirm(`Supprimer ${selectedItems.length} événement(s) ?`)) return;
    
    try {
      await Promise.all(selectedItems.map(id => axios.delete(`${API_URL}/${id}`)));
      setEvents(events.filter(e => !selectedItems.includes(e.id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} événement(s) supprimé(s)`);
    } catch (error) {
      toast.error("Erreur lors de la suppression multiple");
    }
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-600';
      case 'ongoing': return 'bg-green-100 text-green-600';
      case 'past': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status) => {
    switch(status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'past': return 'Passé';
      default: return status;
    }
  };

  // Colonnes pour le tableau
  const columns = [
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
      key: "date",
      label: "Date & Heure",
      render: (item) => (
        <div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{item.time} - {item.endTime}</span>
          </div>
        </div>
      )
    },
    {
      key: "location",
      label: "Lieu",
      render: (item) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{item.location}</span>
        </div>
      )
    },
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
          {item.type}
        </span>
      )
    },
    {
      key: "status",
      label: "Statut",
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
          {getStatusLabel(item.status)}
        </span>
      )
    },
    {
      key: "registrations",
      label: "Inscriptions",
      render: (item) => (
        <div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{item.registered || 0} / {item.capacity || 0}</span>
          </div>
          {item.capacity && (
            <div className="w-24 h-1 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-full bg-accent rounded-full"
                style={{ width: `${((item.registered || 0) / item.capacity) * 100}%` }}
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: "speakers",
      label: "Intervenants",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.speakers?.map(speaker => (
            <span key={speaker} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {speaker}
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
              setSelectedEvent(item);
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
              setSelectedEvent(item);
              setModalMode("edit");
              setIsModalOpen(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteEvent(item.id)}
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
        <h1 className="text-2xl font-bold">Gestion des Événements</h1>
        
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
              setSelectedEvent(null);
              setModalMode("add");
              setIsModalOpen(true);
            }}
            className="btn btn-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un événement
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-75">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre, description ou lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">Tous les statuts</option>
          <option value="upcoming">À venir</option>
          <option value="ongoing">En cours</option>
          <option value="past">Passés</option>
        </select>
      </div>

      {/* Tableau des événements */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedEvents}
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
          <EventModal
            event={selectedEvent}
            mode={modalMode}
            onClose={() => setIsModalOpen(false)}
            onSave={modalMode === "add" ? handleAddEvent : (data) => handleEditEvent(selectedEvent.id, data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal pour ajouter/modifier un événement
const EventModal = ({ event, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || new Date().toISOString().split('T')[0],
    time: event?.time || "09:00",
    endTime: event?.endTime || "12:00",
    location: event?.location || "",
    type: event?.type || "culte",
    status: event?.status || "upcoming",
    capacity: event?.capacity || "",
    speakers: event?.speakers?.join(", ") || "",
    image: event?.image || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      speakers: formData.speakers.split(",").map(s => s.trim()).filter(s => s),
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      registered: event?.registered || 0
    };

    onSave(dataToSave);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === "add" ? "Ajouter un événement" : 
               mode === "edit" ? "Modifier l'événement" : 
               "Détails de l'événement"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode === "view" ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {formData.image && (
                  <img src={formData.image} alt={formData.title} className="w-full h-full object-cover" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Titre</p>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{formData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p>{new Date(formData.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Heure</p>
                  <p>{formData.time} - {formData.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p>{formData.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacité</p>
                  <p>{formData.capacity || "Non limitée"}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{formData.description}</p>
              </div>
              
              {formData.speakers && (
                <div>
                  <p className="text-sm text-gray-500">Intervenants</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.speakers.split(",").map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="culte">Culte</option>
                    <option value="jeunes">Jeunes</option>
                    <option value="priere">Prière</option>
                    <option value="conference">Conférence</option>
                    <option value="etude">Étude Biblique</option>
                    <option value="special">Spécial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Heure début *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Heure fin *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lieu *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Capacité</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="upcoming">À venir</option>
                    <option value="ongoing">En cours</option>
                    <option value="past">Passé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Intervenants (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="speakers"
                  value={formData.speakers}
                  onChange={handleChange}
                  placeholder="Pasteur Jean, Sœur Marie, Frère Marc"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
                >
                  {mode === "add" ? "Ajouter" : "Modifier"}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventsManager;