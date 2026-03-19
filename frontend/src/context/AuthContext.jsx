// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier la session au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Connexion
  const login = async (username, password) => {
    try {
      // Simulation d'appel API - À remplacer par votre vraie API
      // const response = await axios.post('/api/login', { username, password });
      
      // Pour la démo, on utilise des identifiants fixes
      if (username === 'admin' && password === 'Admin123!') {
        const userData = {
          id: 1,
          username: 'admin',
          role: 'admin',
          nom: 'Administrateur',
          email: 'admin@eglise.com'
        };
        
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        toast.success('Connexion réussie !');
        return { success: true };
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion');
      return { success: false, error: error.message };
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      // Validation des mots de passe
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      // Validation du mot de passe (minimum 8 caractères, 1 majuscule, 1 chiffre)
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(userData.password)) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
      }

      // Simulation d'appel API - À remplacer par votre vraie API
      // const response = await axios.post('/api/register', userData);
      
      const newUser = {
        id: Date.now(),
        username: userData.username,
        nom: userData.nom,
        email: userData.email,
        role: 'user'
      };

      // Sauvegarder dans localStorage pour la démo
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (users.some(u => u.username === userData.username)) {
        throw new Error('Ce nom d\'utilisateur existe déjà');
      }
      
      users.push({ ...newUser, password: userData.password });
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
      return { success: false, error: error.message };
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};