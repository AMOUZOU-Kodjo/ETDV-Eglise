import React, { useState, useEffect } from 'react';
import { Save, Edit, Trash2, Plus, Users, Calendar, Activity } from 'lucide-react';
import NavBarAdmin from './NavBarAdmin';

const AdminDashboard = () => {
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

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedStats = localStorage.getItem('churchStats');
    const savedAgeGroups = localStorage.getItem('churchAgeGroups');
    const savedWeeklyData = localStorage.getItem('churchWeeklyData');

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedAgeGroups) setAgeGroups(JSON.parse(savedAgeGroups));
    if (savedWeeklyData) setWeeklyData(JSON.parse(savedWeeklyData));
  }, []);

  // Sauvegarder toutes les données
  const saveAllData = () => {
    localStorage.setItem('churchStats', JSON.stringify(stats));
    localStorage.setItem('churchAgeGroups', JSON.stringify(ageGroups));
    localStorage.setItem('churchWeeklyData', JSON.stringify(weeklyData));
    alert('Données sauvegardées avec succès !');
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
    if (newAgeGroup.tranche && newAgeGroup.nombre > 0) {
      const newId = Math.max(...ageGroups.map(g => g.id), 0) + 1;
      setAgeGroups([...ageGroups, { ...newAgeGroup, id: newId }]);
      setNewAgeGroup({ tranche: "", nombre: 0, couleur: "bg-gray-500" });
      setShowAddForm(false);
    }
  };

  // Supprimer un groupe d'âge
  const deleteAgeGroup = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe d\'âge ?')) {
      setAgeGroups(ageGroups.filter(group => group.id !== id));
    }
  };

  // Couleurs disponibles
  const colorOptions = [
    "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-orange-500", "bg-purple-500", "bg-red-500",
    "bg-pink-500", "bg-indigo-500", "bg-teal-500"
  ];

  return (
    <> <NavBarAdmin/> 
    <div className="bg-base-100 min-h-screen p-5 md:px-[5%]">
      {/* En-tête avec bouton de sauvegarde */}
      <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administration des Données</h1>
        <button 
          onClick={saveAllData}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Sauvegarder tout
        </button>
      </div>

      {/* Section Statistiques principales */}
      <div className="bg-base-200 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-6">Statistiques principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-base-100 p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">Total Abonnés</label>
            <input
              type="number"
              name="totalAbonnes"
              value={stats.totalAbonnes}
              onChange={handleStatsChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">Total Fidèles</label>
            <input
              type="number"
              name="totalFideles"
              value={stats.totalFideles}
              onChange={handleStatsChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">Nouveaux ce mois</label>
            <input
              type="number"
              name="nouveauxMois"
              value={stats.nouveauxMois}
              onChange={handleStatsChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">% Présence</label>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Groupes d'âge</h2>
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
                  <option key={color} value={color}>{color}</option>
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
            <div key={group.id} className="bg-base-100 p-4 rounded-lg">
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
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <div className={`w-8 h-8 rounded-full ${group.couleur}`}></div>
                <button 
                  onClick={() => deleteAgeGroup(group.id)}
                  className="btn btn-error btn-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Données hebdomadaires */}
      <div className="bg-base-200 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Présence hebdomadaire</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyData.map((week, index) => (
            <div key={index} className="bg-base-100 p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">{week.semaine}</label>
              <input
                type="number"
                value={week.pourcentage}
                onChange={(e) => handleWeeklyChange(index, e.target.value)}
                className="input input-bordered w-full"
                min="0"
                max="100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;