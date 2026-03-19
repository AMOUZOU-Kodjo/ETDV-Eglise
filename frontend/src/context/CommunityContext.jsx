// context/CommunityContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CommunityContext = createContext();

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within CommunityProvider');
  }
  return context;
};

export const CommunityProvider = ({ children }) => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const API_URL = 'http://localhost:3000/visitors';

  // Charger les visiteurs
  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setVisitors(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error loading visitors:', error);
      toast.error('Erreur de chargement des visiteurs');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = (data) => {
    const now = new Date();
    const today = now.toDateString();
    const thisWeek = new Date(now.setDate(now.getDate() - 7));
    const thisMonth = new Date(now.setMonth(now.getMonth() - 1));

    setStats({
      total: data.length,
      today: data.filter(v => new Date(v.visitDate).toDateString() === today).length,
      thisWeek: data.filter(v => new Date(v.visitDate) >= thisWeek).length,
      thisMonth: data.filter(v => new Date(v.visitDate) >= thisMonth).length
    });
  };

  // Ajouter un visiteur
  const addVisitor = async (visitorData) => {
    setLoading(true);
    try {
      const newVisitor = {
        ...visitorData,
        id: Date.now().toString(),
        visitDate: new Date().toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(API_URL, newVisitor);
      setVisitors(prev => [response.data, ...prev]);
      calculateStats([response.data, ...visitors]);
      
      toast.success('Inscription réussie ! Nous vous contacterons bientôt.', {
        icon: '🎉',
        duration: 5000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding visitor:', error);
      toast.error('Erreur lors de l\'inscription');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'un visiteur
  const updateVisitorStatus = async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { status });
      setVisitors(prev => 
        prev.map(v => v.id === id ? response.data : v)
      );
      toast.success(`Statut mis à jour: ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur de mise à jour');
    }
  };

  // Supprimer un visiteur
  const deleteVisitor = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setVisitors(prev => prev.filter(v => v.id !== id));
      calculateStats(visitors.filter(v => v.id !== id));
      toast.success('Visiteur supprimé');
    } catch (error) {
      console.error('Error deleting visitor:', error);
      toast.error('Erreur de suppression');
    }
  };

  return (
    <CommunityContext.Provider value={{
      visitors,
      loading,
      stats,
      addVisitor,
      updateVisitorStatus,
      deleteVisitor,
      refreshVisitors: loadVisitors
    }}>
      {children}
    </CommunityContext.Provider>
  );
};