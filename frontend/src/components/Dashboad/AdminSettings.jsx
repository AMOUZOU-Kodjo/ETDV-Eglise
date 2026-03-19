// components/Dashboad/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings,
  User,
  Users,
  Shield,
  Bell,
  Mail,
  Globe,
  Lock,
  Database,
  Download,
  Upload,
  RefreshCw,
  Save,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Fingerprint,
  Smartphone,
  Laptop,
  Moon,
  Sun,
  Palette,
  Languages,
  Clock,
  Calendar,
  Link,
  Share2,
  Code,
  Terminal,
  HardDrive,
  Cloud,
  Wifi,
  Power,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Filter,
  Search,
  LogOut,
  Copy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // État pour les paramètres généraux
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Temple du Dieu Vivant',
    siteDescription: 'Une communauté de foi vivante',
    siteEmail: 'contact@eglise.com',
    sitePhone: '+228 91 03 87 27',
    siteAddress: 'Lomé, Togo',
    siteLogo: '/logo.png',
    favicon: '/favicon.ico',
    language: 'fr',
    timezone: 'Africa/Lome',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h'
  });

  // État pour les paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    requireStrongPassword: true,
    ipWhitelist: [],
    allowedDomains: [],
    backupCodes: []
  });

  // État pour les paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyReport: true,
    monthlyReport: true,
    newVisitorAlert: true,
    newMemberAlert: true,
    eventReminder: true,
    systemAlerts: true
  });

  // État pour les utilisateurs
  const [users, setUsers] = useState([
    {
      id: 1,
      nom: 'Admin Principal',
      email: 'admin@eglise.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-03-19 10:30',
      permissions: ['all']
    },
    {
      id: 2,
      nom: 'Gestionnaire Galerie',
      email: 'gallery@eglise.com',
      role: 'gallery_admin',
      status: 'active',
      lastLogin: '2024-03-18 15:45',
      permissions: ['gallery', 'events']
    },
    {
      id: 3,
      nom: 'Modérateur',
      email: 'modo@eglise.com',
      role: 'moderator',
      status: 'pending',
      lastLogin: null,
      permissions: ['comments', 'users_view']
    }
  ]);

  // État pour les rôles
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      permissions: ['all'],
      description: 'Accès complet à toutes les fonctionnalités'
    },
    {
      id: 2,
      name: 'Admin Galerie',
      permissions: ['gallery', 'events'],
      description: 'Gestion de la galerie et des événements'
    },
    {
      id: 3,
      name: 'Modérateur',
      permissions: ['comments', 'users_view'],
      description: 'Modération des commentaires'
    }
  ]);

  // État pour les logs
  const [logs, setLogs] = useState([
    { id: 1, user: 'Admin', action: 'Connexion', date: '2024-03-19 10:30', ip: '192.168.1.1' },
    { id: 2, user: 'Admin', action: 'Modification paramètres', date: '2024-03-19 09:15', ip: '192.168.1.1' },
    { id: 3, user: 'Gestionnaire', action: 'Ajout photo', date: '2024-03-18 16:20', ip: '192.168.1.2' }
  ]);

  // État pour les sauvegardes
  const [backups, setBackups] = useState([
    { id: 1, date: '2024-03-19 02:00', size: '156 MB', type: 'automatique' },
    { id: 2, date: '2024-03-18 02:00', size: '154 MB', type: 'automatique' },
    { id: 3, date: '2024-03-17 15:30', size: '152 MB', type: 'manuel' }
  ]);

  // Charger les paramètres
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setLoading(true);
    try {
      const savedGeneral = localStorage.getItem('generalSettings');
      const savedSecurity = localStorage.getItem('securitySettings');
      const savedNotifications = localStorage.getItem('notificationSettings');

      if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral));
      if (savedSecurity) setSecuritySettings(JSON.parse(savedSecurity));
      if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
      
      toast.success('Paramètres chargés');
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les paramètres
  const saveSettings = () => {
    try {
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      
      toast.success('Paramètres sauvegardés');
    } catch (error) {
      toast.error('Erreur de sauvegarde');
    }
  };

  // Réinitialiser les paramètres
  const resetSettings = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      localStorage.removeItem('generalSettings');
      localStorage.removeItem('securitySettings');
      localStorage.removeItem('notificationSettings');
      loadSettings();
      toast.success('Paramètres réinitialisés');
    }
  };

  // Exporter les paramètres
  const exportSettings = () => {
    const data = {
      general: generalSettings,
      security: securitySettings,
      notifications: notificationSettings,
      exportDate: new Date().toISOString(),
      exportedBy: user?.nom
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast.success('Paramètres exportés');
  };

  // Importer les paramètres
  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.general) setGeneralSettings(data.general);
        if (data.security) setSecuritySettings(data.security);
        if (data.notifications) setNotificationSettings(data.notifications);
        
        toast.success('Paramètres importés');
      } catch (error) {
        toast.error('Fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  // Créer une sauvegarde
  const createBackup = () => {
    const backup = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      size: '~150 MB',
      type: 'manuel'
    };
    setBackups([backup, ...backups]);
    toast.success('Sauvegarde créée');
  };

  // Restaurer une sauvegarde
  const restoreBackup = (id) => {
    if (window.confirm('Restaurer cette sauvegarde ? Les données actuelles seront écrasées.')) {
      toast.success('Sauvegarde restaurée');
    }
  };

  // Supprimer un utilisateur
  const deleteUser = (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('Utilisateur supprimé');
    }
  };

  // Changer le statut d'un utilisateur
  const toggleUserStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ));
    toast.success('Statut mis à jour');
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Sauvegardes', icon: Database },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'permissions', label: 'Permissions', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <Toaster position="top-right" />

      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-xl">
            <Settings className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-base-content/70">
              Gérez la configuration de votre site
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportSettings}
            className="btn btn-outline btn-accent gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
          
          <label className="btn btn-outline btn-accent gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Importer
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
          
          <button
            onClick={resetSettings}
            className="btn btn-outline btn-warning gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Réinitialiser
          </button>
          
          <button
            onClick={saveSettings}
            className="btn btn-primary gap-2"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
                transition-all duration-300
                ${isActive 
                  ? 'bg-accent text-white shadow-lg scale-105' 
                  : 'bg-base-200 hover:bg-base-300 text-base-content/70'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-base-200 rounded-2xl p-6 shadow-xl"
        >
          {/* Onglet Général */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">Paramètres généraux</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={generalSettings.siteEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteEmail: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.sitePhone}
                    onChange={(e) => setGeneralSettings({...generalSettings, sitePhone: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteAddress}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteAddress: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Langue
                  </label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                    className="select select-bordered w-full"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fuseau horaire
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    className="select select-bordered w-full"
                  >
                    <option value="Africa/Lome">Africa/Lome (GMT+0)</option>
                    <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                    <option value="America/New_York">America/New_York (GMT-5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description du site
                </label>
                <textarea
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  rows="4"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">Paramètres de sécurité</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">Authentification à deux facteurs</p>
                      <p className="text-sm text-base-content/50">Sécuriser les connexions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${securitySettings.twoFactorAuth ? 'bg-accent' : 'bg-base-300'}`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${securitySettings.twoFactorAuth ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Timeout de session (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    className="input input-bordered w-full"
                    min="5"
                    max="120"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tentatives de connexion max
                  </label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="input input-bordered w-full"
                    min="3"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiration mot de passe (jours)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                    className="input input-bordered w-full"
                    min="30"
                    max="365"
                  />
                </div>
              </div>

              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Zone sensible</p>
                    <p className="text-sm text-base-content/70">
                      La modification des paramètres de sécurité peut affecter l'accès au site.
                      Assurez-vous de bien comprendre les changements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Utilisateurs */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gestion des utilisateurs</h2>
                <button className="btn btn-primary gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvel utilisateur
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-base-300">
                    <tr>
                      <th className="px-4 py-3 text-left">Utilisateur</th>
                      <th className="px-4 py-3 text-left">Rôle</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Dernière connexion</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-base-300">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{user.nom}</p>
                            <p className="text-sm text-base-content/50">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge badge-accent">{user.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${
                            user.status === 'active' ? 'badge-success' :
                            user.status === 'pending' ? 'badge-warning' :
                            'badge-error'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-base-content/50">
                          {user.lastLogin || 'Jamais'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className="p-2 hover:bg-base-300 rounded-lg"
                              title={user.status === 'active' ? 'Suspendre' : 'Activer'}
                            >
                              {user.status === 'active' ? (
                                <ToggleRight className="w-4 h-4 text-success" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-error" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingUserId(user.id)}
                              className="p-2 hover:bg-base-300 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 hover:bg-base-300 rounded-lg text-error"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">Préférences de notification</h2>
              
              <div className="grid gap-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, [key]: !value})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-accent' : 'bg-base-300'}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Sauvegardes */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Sauvegardes</h2>
                <button
                  onClick={createBackup}
                  className="btn btn-primary gap-2"
                >
                  <Database className="w-4 h-4" />
                  Créer une sauvegarde
                </button>
              </div>

              <div className="grid gap-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <HardDrive className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">{backup.date}</p>
                        <p className="text-sm text-base-content/50">
                          {backup.size} • {backup.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => restoreBackup(backup.id)}
                        className="btn btn-sm btn-outline btn-accent"
                      >
                        Restaurer
                      </button>
                      <button className="btn btn-sm btn-outline btn-error">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-accent">Sauvegarde automatique</p>
                    <p className="text-sm text-base-content/70">
                      Les sauvegardes automatiques sont effectuées tous les jours à 02:00.
                      Les 10 dernières sauvegardes sont conservées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Journal d'activité</h2>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-accent btn-sm gap-2">
                    <Filter className="w-4 h-4" />
                    Filtrer
                  </button>
                  <button className="btn btn-outline btn-accent btn-sm gap-2">
                    <Download className="w-4 h-4" />
                    Exporter
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Rechercher dans les logs..."
                  className="input input-bordered w-full pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-base-300">
                    <tr>
                      <th className="px-4 py-3 text-left">Utilisateur</th>
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-base-300">
                        <td className="px-4 py-3 font-medium">{log.user}</td>
                        <td className="px-4 py-3">{log.action}</td>
                        <td className="px-4 py-3 text-sm text-base-content/50">{log.date}</td>
                        <td className="px-4 py-3 text-sm text-base-content/50">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Onglet Permissions */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gestion des rôles</h2>
                <button className="btn btn-primary gap-2">
                  <Plus className="w-4 h-4" />
                  Nouveau rôle
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="bg-base-100 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{role.name}</h3>
                        <p className="text-sm text-base-content/50">{role.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-base-300 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-base-300 rounded-lg text-error">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium mb-2">Permissions :</p>
                      {role.permissions.map((perm, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-3 h-3 text-success" />
                          <span className="capitalize">{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer du dashboard */}
      <div className="mt-8 flex justify-between items-center text-sm text-base-content/50">
        <p>
          Dernière modification : {new Date().toLocaleString()}
        </p>
        <div className="flex items-center gap-4">
          <button className="hover:text-accent transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="hover:text-accent transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;