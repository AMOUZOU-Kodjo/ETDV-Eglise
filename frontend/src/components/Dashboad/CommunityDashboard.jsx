import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Activity } from 'lucide-react';

const CommunityDashboard = () => {
  const [stats, setStats] = useState({
    totalAbonnes: 0,
    totalFideles: 0,
    nouveauxMois: 0,
    pourcentagePresence: 0
  });

  const [ageGroups, setAgeGroups] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);

  // Charger les données depuis localStorage
  useEffect(() => {
    const loadData = () => {
      const savedStats = localStorage.getItem('churchStats');
      const savedAgeGroups = localStorage.getItem('churchAgeGroups');
      const savedWeeklyData = localStorage.getItem('churchWeeklyData');

      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedAgeGroups) setAgeGroups(JSON.parse(savedAgeGroups));
      if (savedWeeklyData) setWeeklyData(JSON.parse(savedWeeklyData));
    };

    loadData();

    // Écouter les changements dans localStorage (si l'admin modifie les données)
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Calculer le total pour les pourcentages
  const totalFidelesAge = ageGroups.reduce((acc, group) => acc + group.nombre, 0);

  // Calculer l'âge moyen
  const calculerAgeMoyen = () => {
    if (ageGroups.length === 0) return 0;
    
    let totalPersonnes = 0;
    let sommeAges = 0;
    
    ageGroups.forEach(group => {
      const [min, max] = group.tranche.split('-').map(n => parseInt(n));
      if (group.tranche.includes('et plus')) {
        const age = parseInt(group.tranche) + 10; // Approximation pour les 51+
        sommeAges += age * group.nombre;
      } else if (min && max) {
        const ageMoyen = (min + max) / 2;
        sommeAges += ageMoyen * group.nombre;
      }
      totalPersonnes += group.nombre;
    });
    
    return Math.round(sommeAges / totalPersonnes);
  };

  if (ageGroups.length === 0) {
    return (
      <div className="p-5 md:px-[5%] bg-base-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Aucune donnée disponible</h2>
          <p>Veuillez vous connecter à l'interface d'administration pour ajouter des données.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-center mb-4">
          Statistiques des abonnés et fidèles de l'église
        </h1>
        {/* <p className="text-center text-gray-600">
          Statistiques des abonnés et fidèles de l'église
        </p> */}
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-base-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Abonnés</h3>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-500">{stats.totalAbonnes}</p>
          <p className="text-sm text-gray-500 mt-2">Total des abonnés</p>
        </div>

        <div className="bg-base-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Fidèles</h3>
            <UserPlus className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500">{stats.totalFideles}</p>
          <p className="text-sm text-gray-500 mt-2">Membres actifs</p>
        </div>

        <div className="bg-base-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Nouveaux ce mois</h3>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats.nouveauxMois}</p>
          <p className="text-sm text-gray-500 mt-2">
            +{stats.totalFideles > 0 ? ((stats.nouveauxMois / stats.totalFideles) * 100).toFixed(1) : 0}% de croissance
          </p>
        </div>

        <div className="bg-base-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Présence moyenne</h3>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-500">{stats.pourcentagePresence}%</p>
          <p className="text-sm text-gray-500 mt-2">aux cultes dominicaux</p>
        </div>
      </div>

      {/* Section Répartition par âge */}
      <div className="bg-base-200 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Répartition des fidèles par tranche d'âge
        </h2>

        {/* Graphique à barres */}
        <div className="space-y-4 mb-8">
          {ageGroups.map((group, index) => (
            <div 
              key={index} 
              className="relative cursor-pointer hover:scale-105 transition-transform"
              onMouseEnter={() => setSelectedAgeGroup(group)}
              onMouseLeave={() => setSelectedAgeGroup(null)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{group.tranche}</span>
                <span className="text-sm font-medium">{group.nombre} fidèles</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div 
                  className={`${group.couleur} h-4 rounded-full transition-all duration-300`}
                  style={{ width: totalFidelesAge > 0 ? `${(group.nombre / totalFidelesAge) * 100}%` : '0%' }}
                ></div>
              </div>
              
              {selectedAgeGroup === group && (
                <div className="absolute right-0 -top-12 bg-base-100 p-2 rounded-lg shadow-xl text-sm z-10">
                  <p className="font-bold">{group.tranche}</p>
                  <p>{group.nombre} personnes ({((group.nombre / totalFidelesAge) * 100).toFixed(1)}%)</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {ageGroups.map((group, index) => (
            <div key={index} className="bg-base-100 p-4 rounded-lg">
              <h3 className={`font-bold text-lg mb-2 ${group.couleur.replace('bg-', 'text-')}`}>
                {group.tranche}
              </h3>
              <p className="text-2xl font-bold">{group.nombre}</p>
              <p className="text-sm">{((group.nombre / totalFidelesAge) * 100).toFixed(1)}% de la communauté</p>
            </div>
          ))}
        </div>

        {/* Âge moyen */}
        <div className="mt-6 p-4 bg-base-100 rounded-lg">
          <h3 className="font-bold text-lg mb-2 text-center">Âge moyen</h3>
          <p className="text-2xl font-bold text-center">{calculerAgeMoyen()} ans</p>
          <p className="text-sm text-center">Moyenne de la communauté</p>
        </div>
      </div>

      {/* Section des tendances hebdomadaires */}
      {weeklyData.length > 0 && (
        <div className="mt-8 bg-base-200 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-4">Évolution mensuelle de la présence</h3>
          <div className="space-y-3">
            {weeklyData.map((week, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{week.semaine}</span>
                <div className="w-2/3 bg-gray-300 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${week.pourcentage}%` }}></div>
                </div>
                <span>{week.pourcentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDashboard;