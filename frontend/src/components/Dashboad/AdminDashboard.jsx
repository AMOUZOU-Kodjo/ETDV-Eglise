import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Edit, 
  Trash2, 
  Plus, 
  Users, 
  Calendar, 
  Activity,
  LogOut,
  User,
  Settings,
  BarChart3,
  TrendingUp,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalAbonnes: 1250,
    totalFideles: 85,
    nouveauxMois: 45,
    pourcentagePresence: 78
  });

  const [ageGroups, setAgeGroups] = useState([
    { id: 1, tranche: "0-12 ans", nombre: 120, couleur: "bg-blue-500" },
    { id: 2, tranche: "13-17 ans", nombre: 85, couleur: "bg-green-500" },
    { id: 3, tranche: "18-25 ans", nombre: 210, couleur: "bg-yellow-500" },
    { id: 4, tranche: "26-35 ans", nombre: 195, couleur: "bg-orange-500" },
    { id: 5, tranche: "36-50 ans", nombre: 150, couleur: "bg-purple-500" },
    { id: 6, tranche: "51 ans et plus", nombre: 90, couleur: "bg-red-500" }
  ]);

  const [weeklyData, setWeeklyData] = useState([
    { semaine: "Semaine 1", pourcentage: 75 },
    { semaine: "Semaine 2", pourcentage: 82 },
    { semaine: "Semaine 3", pourcentage: 78 },
    { semaine: "Semaine 4", pourcentage: 88 }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newAgeGroup, setNewAgeGroup] = useState({ tranche: "", nombre: 0, couleur: "bg-gray-500" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const savedStats = localStorage.getItem('churchStats');
      const savedAgeGroups = localStorage.getItem('churchAgeGroups');
      const savedWeeklyData = localStorage.getItem('churchWeeklyData');

      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedAgeGroups) setAgeGroups(JSON.parse(savedAgeGroups));
      if (savedWeeklyData) setWeeklyData(JSON.parse(savedWeeklyData));
      
      toast.success('Données chargées avec succès');
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder toutes les données
  const saveAllData = () => {
    try {
      localStorage.setItem('churchStats', JSON.stringify(stats));
      localStorage.setItem('churchAgeGroups', JSON.stringify(ageGroups));
      localStorage.setItem('churchWeeklyData', JSON.stringify(weeklyData));
      
      toast.success('Données sauvegardées avec succès !', {
        icon: '💾',
        duration: 3000
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  // Exporter les données
  const exportData = () => {
    const data = {
      stats,
      ageGroups,
      weeklyData,
      exportDate: new Date().toISOString(),
      exportedBy: user?.nom
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donnees-eglise-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast.success('Données exportées avec succès');
  };

  // Mettre à jour les stats
  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  // Mettre à jour un groupe d'âge
  const handleAgeGroupChange = (id, field, value) => {
    setAgeGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, [field]: field === 'nombre' ? parseInt(value) || 0 : value } : group
      )
    );
  };

  // Mettre à jour les données hebdomadaires
  const handleWeeklyChange = (index, value) => {
    const newWeeklyData = [...weeklyData];
    newWeeklyData[index].pourcentage = parseInt(value) || 0;
    setWeeklyData(newWeeklyData);
  };

  // Ajouter un nouveau groupe d'âge
  const addAgeGroup = () => {
    if (!newAgeGroup.tranche) {
      toast.error('Veuillez entrer une tranche d\'âge');
      return;
    }
    if (newAgeGroup.nombre <= 0) {
      toast.error('Le nombre doit être supérieur à 0');
      return;
    }

    const newId = Math.max(...ageGroups.map(g => g.id), 0) + 1;
    setAgeGroups([...ageGroups, { ...newAgeGroup, id: newId }]);
    setNewAgeGroup({ tranche: "", nombre: 0, couleur: "bg-gray-500" });
    setShowAddForm(false);
    
    toast.success('Groupe d\'âge ajouté');
  };

  // Supprimer un groupe d'âge
  const deleteAgeGroup = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe d\'âge ?')) {
      setAgeGroups(ageGroups.filter(group => group.id !== id));
      toast.success('Groupe d\'âge supprimé');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Couleurs disponibles
  const colorOptions = [
    "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-orange-500", "bg-purple-500", "bg-red-500",
    "bg-pink-500", "bg-indigo-500", "bg-teal-500"
  ];

  return (
    <> 
      <Toaster position="top-right" />
      
      <div className="bg-base-100 min-h-screen p-5 md:px-[5%]">
        {/* En-tête avec informations utilisateur */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 mt-10">
          <div>
            <h1 className="text-3xl font-bold">Administration des Données</h1>
            {user && (
              <div className="flex items-center gap-2 mt-2">
                <div className="badge badge-accent gap-2 p-3">
                  <User className="w-4 h-4" />
                  <span>{user.nom}</span>
                </div>
                <div className="badge badge-outline gap-2 p-3">
                  <span className="text-xs">Rôle: {user.role}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={loadData}
              className="btn btn-outline btn-accent flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            
            <button 
              onClick={exportData}
              className="btn btn-outline btn-accent flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exporter
            </button>
            
            <button 
              onClick={saveAllData}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
            
            <button 
              onClick={handleLogout}
              className="btn btn-error flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Section Statistiques principales */}
        <div className="bg-base-200 p-6 rounded-xl shadow-lg mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Statistiques principales</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-base-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                <Users className="w-4 h-4 text-accent" />
                Total Abonnés
              </label>
              <input
                type="number"
                name="totalAbonnes"
                value={stats.totalAbonnes}
                onChange={handleStatsChange}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="bg-base-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                <Users className="w-4 h-4 text-accent" />
                Total Fidèles
              </label>
              <input
                type="number"
                name="totalFideles"
                value={stats.totalFideles}
                onChange={handleStatsChange}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="bg-base-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                Nouveaux ce mois
              </label>
              <input
                type="number"
                name="nouveauxMois"
                value={stats.nouveauxMois}
                onChange={handleStatsChange}
                className="input input-bordered w-full"
              />
            </div>
            
            <div className="bg-base-100 p-4 rounded-lg hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                <Activity className="w-4 h-4 text-accent" />
                % Présence
              </label>
              <input
                type="number"
                name="pourcentagePresence"
                value={stats.pourcentagePresence}
                onChange={handleStatsChange}
                className="input input-bordered w-full"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Section Groupes d'âge */}
        <div className="bg-base-200 p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold">Groupes d'âge</h2>
            </div>
            
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un groupe
            </button>
          </div>

          {/* Formulaire d'ajout */}
          {showAddForm && (
            <div className="bg-base-100 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-4">Nouveau groupe d'âge</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Tranche (ex: 0-12 ans)"
                  value={newAgeGroup.tranche}
                  onChange={(e) => setNewAgeGroup({...newAgeGroup, tranche: e.target.value})}
                  className="input input-bordered"
                />
                <input
                  type="number"
                  placeholder="Nombre"
                  value={newAgeGroup.nombre}
                  onChange={(e) => setNewAgeGroup({...newAgeGroup, nombre: parseInt(e.target.value) || 0})}
                  className="input input-bordered"
                />
                <select
                  value={newAgeGroup.couleur}
                  onChange={(e) => setNewAgeGroup({...newAgeGroup, couleur: e.target.value})}
                  className="select select-bordered"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>{color.replace('bg-', '').replace('-500', '')}</option>
                  ))}
                </select>
                <button onClick={addAgeGroup} className="btn btn-primary">
                  Ajouter
                </button>
              </div>
            </div>
          )}

          {/* Liste des groupes d'âge */}
          <div className="space-y-4">
            {ageGroups.map((group) => (
              <div key={group.id} className="bg-base-100 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <input
                    type="text"
                    value={group.tranche}
                    onChange={(e) => handleAgeGroupChange(group.id, 'tranche', e.target.value)}
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    value={group.nombre}
                    onChange={(e) => handleAgeGroupChange(group.id, 'nombre', e.target.value)}
                    className="input input-bordered"
                  />
                  <select
                    value={group.couleur}
                    onChange={(e) => handleAgeGroupChange(group.id, 'couleur', e.target.value)}
                    className="select select-bordered"
                  >
                    {colorOptions.map(color => (
                      <option key={color} value={color}>{color.replace('bg-', '').replace('-500', '')}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${group.couleur}`}></div>
                    <span className="text-sm text-base-content/50">
                      {group.nombre} personnes
                    </span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => deleteAgeGroup(group.id)}
                      className="btn btn-error btn-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Données hebdomadaires */}
        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Présence hebdomadaire</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyData.map((week, index) => (
              <div key={index} className="bg-base-100 p-4 rounded-lg hover:shadow-md transition-shadow">
                <label className="block text-sm font-medium mb-2">{week.semaine}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={week.pourcentage}
                    onChange={(e) => handleWeeklyChange(index, e.target.value)}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm font-bold text-accent">%</span>
                </div>
                {/* Barre de progression */}
                <div className="w-full bg-base-300 h-2 rounded-full mt-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${week.pourcentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé des données */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h3 className="font-semibold mb-2">Total des membres</h3>
            <p className="text-3xl font-bold text-accent">
              {stats.totalAbonnes + stats.totalFideles}
            </p>
            <p className="text-sm text-base-content/50">
              Abonnés: {stats.totalAbonnes} | Fidèles: {stats.totalFideles}
            </p>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h3 className="font-semibold mb-2">Moyenne de présence</h3>
            <p className="text-3xl font-bold text-accent">
              {Math.round(weeklyData.reduce((acc, w) => acc + w.pourcentage, 0) / weeklyData.length)}%
            </p>
            <p className="text-sm text-base-content/50">
              Sur les 4 dernières semaines
            </p>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h3 className="font-semibold mb-2">Nouveaux ce mois</h3>
            <p className="text-3xl font-bold text-accent">
              {stats.nouveauxMois}
            </p>
            <p className="text-sm text-base-content/50">
              Croissance positive
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;