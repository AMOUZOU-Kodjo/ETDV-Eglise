// components/Dashboad/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users,
  UserPlus,
  UserCheck,
  UserX,
  UserCog,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Printer,
  Settings,
  Award,
  Star,
  Clock,
  Activity,
  BarChart3,
  TrendingUp,
  Users2,
  UserRound,
  UserRoundPlus,
  UserRoundCheck,
  UserRoundX,
  UserRoundCog,
  MailCheck,
  MailX,
  PhoneCall,
  PhoneOff,
  Fingerprint,
  ShieldCheck,
  ShieldOff,
  Ban,
  Flag,
  MessageCircle,
  MessageSquare,
  MessageCircleWarning,
  Bell,
  BellOff,
  Gift,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // grid ou list
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Données simulées des utilisateurs
  const [users, setUsers] = useState([
    {
      id: 1,
      nom: 'Jean Kouamé',
      email: 'jean.kouame@email.com',
      telephone: '+225 07 89 65 43',
      role: 'super_admin',
      status: 'active',
      avatar: null,
      dateInscription: '2024-01-15',
      derniereConnexion: '2024-03-19 10:30',
      permissions: ['all'],
      services: ['culte', 'enseignement', 'jeunes'],
      adresse: 'Abidjan, Cocody',
      dateNaissance: '1985-06-15',
      sexe: 'M',
      notes: 'Responsable principal',
      badges: ['vétéran', 'fidèle'],
      activites: 234,
      contributions: 45,
      abonnement: 'premium',
      deuxFacteurs: true,
      emailVerifie: true,
      telephoneVerifie: true
    },
    {
      id: 2,
      nom: 'Marie Konan',
      email: 'marie.konan@email.com',
      telephone: '+225 01 23 45 67',
      role: 'gallery_admin',
      status: 'active',
      avatar: null,
      dateInscription: '2024-02-20',
      derniereConnexion: '2024-03-18 15:45',
      permissions: ['gallery', 'events'],
      services: ['louange', 'jeunes'],
      adresse: 'Abidjan, Plateau',
      dateNaissance: '1990-03-22',
      sexe: 'F',
      notes: 'Responsable galerie',
      badges: ['active'],
      activites: 156,
      contributions: 23,
      abonnement: 'gratuit',
      deuxFacteurs: false,
      emailVerifie: true,
      telephoneVerifie: false
    },
    {
      id: 3,
      nom: 'Paul Yao',
      email: 'paul.yao@email.com',
      telephone: '+225 05 55 44 33',
      role: 'moderator',
      status: 'pending',
      avatar: null,
      dateInscription: '2024-03-01',
      derniereConnexion: null,
      permissions: ['comments', 'users_view'],
      services: ['accueil'],
      adresse: 'Abidjan, Yopougon',
      dateNaissance: '1995-11-08',
      sexe: 'M',
      notes: 'En attente de validation',
      badges: ['nouveau'],
      activites: 12,
      contributions: 3,
      abonnement: 'gratuit',
      deuxFacteurs: false,
      emailVerifie: false,
      telephoneVerifie: false
    },
    {
      id: 4,
      nom: 'Sophie Koffi',
      email: 'sophie.koffi@email.com',
      telephone: '+225 02 34 56 78',
      role: 'member',
      status: 'suspended',
      avatar: null,
      dateInscription: '2024-01-10',
      derniereConnexion: '2024-02-28 08:20',
      permissions: ['basic'],
      services: ['prière'],
      adresse: 'Abidjan, Marcory',
      dateNaissance: '1988-09-30',
      sexe: 'F',
      notes: 'Compte suspendu temporairement',
      badges: [],
      activites: 89,
      contributions: 12,
      abonnement: 'gratuit',
      deuxFacteurs: false,
      emailVerifie: true,
      telephoneVerifie: true
    },
    {
      id: 5,
      nom: 'Thomas N\'Guessan',
      email: 'thomas.nguessan@email.com',
      telephone: '+225 07 77 88 99',
      role: 'member',
      status: 'active',
      avatar: null,
      dateInscription: '2024-02-05',
      derniereConnexion: '2024-03-17 14:10',
      permissions: ['basic'],
      services: ['jeunes', 'sport'],
      adresse: 'Abidjan, Bingerville',
      dateNaissance: '2000-12-01',
      sexe: 'M',
      notes: 'Membre actif du groupe jeunes',
      badges: ['jeune', 'actif'],
      activites: 67,
      contributions: 8,
      abonnement: 'gratuit',
      deuxFacteurs: false,
      emailVerifie: true,
      telephoneVerifie: true
    }
  ]);

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    enAttente: 0,
    suspendus: 0,
    admins: 0,
    nouveauxMois: 0,
    connexionsAujourdhui: 0,
    tauxEngagement: 0
  });

  // Calculer les statistiques
  useEffect(() => {
    const actifs = users.filter(u => u.status === 'active').length;
    const enAttente = users.filter(u => u.status === 'pending').length;
    const suspendus = users.filter(u => u.status === 'suspended').length;
    const admins = users.filter(u => ['super_admin', 'admin'].includes(u.role)).length;
    const aujourdhui = new Date().toDateString();
    const connexionsAujourdhui = users.filter(u => 
      u.derniereConnexion?.includes(aujourdhui)
    ).length;

    setStats({
      total: users.length,
      actifs,
      enAttente,
      suspendus,
      admins,
      nouveauxMois: users.filter(u => u.dateInscription?.startsWith('2024-03')).length,
      connexionsAujourdhui,
      tauxEngagement: Math.round((actifs / users.length) * 100) || 0
    });
  }, [users]);

  // Filtrer les utilisateurs
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telephone?.includes(searchTerm);
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.nom.localeCompare(b.nom);
        case 'date':
          return new Date(b.dateInscription) - new Date(a.dateInscription);
        case 'activity':
          return b.activites - a.activites;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestionnaire de sélection multiple
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  // Actions sur les utilisateurs
  const activateUser = (userId) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: 'active' } : u
    ));
    toast.success('Utilisateur activé');
  };

  const suspendUser = (userId) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: 'suspended' } : u
    ));
    toast.success('Utilisateur suspendu');
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('Utilisateur supprimé');
  };

  const resendVerification = (userId) => {
    toast.success('Email de vérification renvoyé');
  };

  const resetPassword = (userId) => {
    toast.success('Email de réinitialisation envoyé');
  };

  const exportUsers = () => {
    const data = filteredUsers.map(u => ({
      Nom: u.nom,
      Email: u.email,
      Téléphone: u.telephone,
      Rôle: u.role,
      Statut: u.status,
      Inscription: u.dateInscription,
      Dernièreconnexion: u.derniereConnexion,
      Activités: u.activites
    }));

    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Export terminé');
  };

  // Rôles disponibles
  const roles = [
    { value: 'super_admin', label: 'Super Admin', color: 'badge-error' },
    { value: 'admin', label: 'Admin', color: 'badge-warning' },
    { value: 'gallery_admin', label: 'Admin Galerie', color: 'badge-info' },
    { value: 'moderator', label: 'Modérateur', color: 'badge-primary' },
    { value: 'member', label: 'Membre', color: 'badge-success' },
    { value: 'visitor', label: 'Visiteur', color: 'badge-ghost' }
  ];

  const getRoleBadge = (role) => {
    const found = roles.find(r => r.value === role);
    return found || { label: role, color: 'badge-ghost' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Actif', color: 'badge-success' },
      pending: { label: 'En attente', color: 'badge-warning' },
      suspended: { label: 'Suspendu', color: 'badge-error' },
      inactive: { label: 'Inactif', color: 'badge-ghost' }
    };
    return badges[status] || { label: status, color: 'badge-ghost' };
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <Toaster position="top-right" />

      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-xl">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            <p className="text-base-content/70">
              Gérez les comptes et les permissions
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportUsers}
            className="btn btn-outline btn-accent gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Total</div>
          <div className="stat-value text-2xl">{stats.total}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Actifs</div>
          <div className="stat-value text-2xl text-success">{stats.actifs}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">En attente</div>
          <div className="stat-value text-2xl text-warning">{stats.enAttente}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Suspendus</div>
          <div className="stat-value text-2xl text-error">{stats.suspendus}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Admins</div>
          <div className="stat-value text-2xl">{stats.admins}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Nouveaux (mois)</div>
          <div className="stat-value text-2xl">{stats.nouveauxMois}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Connexions aujourd'hui</div>
          <div className="stat-value text-2xl">{stats.connexionsAujourdhui}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-3">
          <div className="stat-title text-xs">Engagement</div>
          <div className="stat-value text-2xl">{stats.tauxEngagement}%</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-base-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Tous les rôles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
              <option value="inactive">Inactif</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="date">Date d'inscription</option>
              <option value="name">Nom</option>
              <option value="activity">Activité</option>
            </select>

            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-accent text-white' : 'bg-base-100 hover:bg-base-300'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-accent text-white' : 'bg-base-100 hover:bg-base-300'
                }`}
              >
                <UserRound className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions en masse */}
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 pt-4 border-t border-base-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </p>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-success gap-1">
                  <Mail className="w-3 h-3" />
                  Envoyer un message
                </button>
                <button className="btn btn-sm btn-warning gap-1">
                  <UserRoundCheck className="w-3 h-3" />
                  Activer
                </button>
                <button className="btn btn-sm btn-error gap-1">
                  <Ban className="w-3 h-3" />
                  Suspendre
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="btn btn-sm btn-ghost"
                >
                  <XCircle className="w-3 h-3" />
                  Annuler
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Vue Grille */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedUsers.map((user) => (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-base-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-24 bg-linear-to-r from-accent to-pink-500">
                <div className="absolute -bottom-12 left-4">
                  <div className="w-24 h-24 rounded-xl bg-base-300 border-4 border-base-200 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.nom} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent text-3xl font-bold">
                        {user.nom.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-1">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="checkbox checkbox-sm bg-white/20 border-white"
                  />
                </div>
              </div>

              <div className="pt-14 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{user.nom}</h3>
                    <p className="text-sm text-base-content/50">{user.email}</p>
                  </div>
                  <div className="dropdown dropdown-end">
                    <button className="p-1 hover:bg-base-300 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li><a onClick={() => setSelectedUser(user)}>Voir détails</a></li>
                      <li><a onClick={() => setShowEditModal(true)}>Modifier</a></li>
                      <li><a onClick={() => resetPassword(user.id)}>Réinitialiser mot de passe</a></li>
                      <li className="text-error"><a onClick={() => setShowDeleteModal(true)}>Supprimer</a></li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <span className={`badge ${getRoleBadge(user.role).color} badge-sm`}>
                    {getRoleBadge(user.role).label}
                  </span>
                  <span className={`badge ${getStatusBadge(user.status).color} badge-sm`}>
                    {getStatusBadge(user.status).label}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Mail className="w-3 h-3" />
                    <span className="truncate flex-1">{user.email}</span>
                    {user.emailVerifie ? (
                      <CheckCircle className="w-3 h-3 text-success" />
                    ) : (
                      <XCircle className="w-3 h-3 text-error" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Phone className="w-3 h-3" />
                    <span className="truncate flex-1">{user.telephone || 'Non renseigné'}</span>
                    {user.telephoneVerifie ? (
                      <CheckCircle className="w-3 h-3 text-success" />
                    ) : (
                      <XCircle className="w-3 h-3 text-error" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-base-content/60">
                    <Calendar className="w-3 h-3" />
                    <span>Inscrit le {new Date(user.dateInscription).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-base-300 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-sm">{user.activites} activités</span>
                  </div>
                  <div className="flex gap-1">
                    {user.badges?.map((badge, i) => (
                      <div key={i} className="tooltip" data-tip={badge}>
                        <Award className="w-4 h-4 text-warning" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vue Liste */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length}
                    onChange={selectAllUsers}
                    className="checkbox checkbox-sm"
                  />
                </th>
                <th>Utilisateur</th>
                <th>Contact</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscription</th>
                <th>Dernière connexion</th>
                <th>Activité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-base-200">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="checkbox checkbox-sm"
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                        {user.nom.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold">{user.nom}</div>
                        <div className="text-sm text-base-content/50">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3" />
                        {user.telephone || '-'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getRoleBadge(user.role).color} badge-sm`}>
                      {getRoleBadge(user.role).label}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(user.status).color} badge-sm`}>
                      {getStatusBadge(user.status).label}
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="text-sm">
                    {user.derniereConnexion || 'Jamais'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{user.activites}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1 hover:bg-base-300 rounded"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="p-1 hover:bg-base-300 rounded"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => suspendUser(user.id)}
                          className="p-1 hover:bg-base-300 rounded text-warning"
                          title="Suspendre"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => activateUser(user.id)}
                          className="p-1 hover:bg-base-300 rounded text-success"
                          title="Activer"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-base-200 hover:bg-base-300 disabled:opacity-50"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
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
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'bg-base-200 hover:bg-base-300'
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
            className="p-2 rounded-lg bg-base-200 hover:bg-base-300 disabled:opacity-50"
          >
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      )}

      {/* Modal détails utilisateur */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60"
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent text-3xl font-bold">
                      {selectedUser.nom.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedUser.nom}</h2>
                      <p className="text-base-content/50">{selectedUser.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`badge ${getRoleBadge(selectedUser.role).color}`}>
                          {getRoleBadge(selectedUser.role).label}
                        </span>
                        <span className={`badge ${getStatusBadge(selectedUser.status).color}`}>
                          {getStatusBadge(selectedUser.status).label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-base-300 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Informations personnelles</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-base-content/50" />
                        <span>{selectedUser.telephone || 'Non renseigné'}</span>
                        {selectedUser.telephoneVerifie ? (
                          <CheckCircle className="w-3 h-3 text-success" />
                        ) : (
                          <XCircle className="w-3 h-3 text-error" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-base-content/50" />
                        <span>{selectedUser.adresse || 'Non renseignée'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-base-content/50" />
                        <span>Né(e) le {new Date(selectedUser.dateNaissance).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <UserRound className="w-4 h-4 text-base-content/50" />
                        <span>{selectedUser.sexe === 'M' ? 'Homme' : 'Femme'}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.services?.map((service, i) => (
                          <span key={i} className="badge badge-accent badge-outline">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Activité</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-base-200 p-3 rounded-lg text-center">
                        <Activity className="w-5 h-5 mx-auto mb-1 text-accent" />
                        <div className="text-xl font-bold">{selectedUser.activites}</div>
                        <div className="text-xs text-base-content/50">Activités</div>
                      </div>
                      
                      <div className="bg-base-200 p-3 rounded-lg text-center">
                        <Star className="w-5 h-5 mx-auto mb-1 text-warning" />
                        <div className="text-xl font-bold">{selectedUser.contributions}</div>
                        <div className="text-xs text-base-content/50">Contributions</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Date d'inscription</span>
                        <span className="font-medium">
                          {new Date(selectedUser.dateInscription).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dernière connexion</span>
                        <span className="font-medium">
                          {selectedUser.derniereConnexion || 'Jamais'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Abonnement</span>
                        <span className="font-medium capitalize">{selectedUser.abonnement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2FA activé</span>
                        <span>
                          {selectedUser.deuxFacteurs ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-error" />
                          )}
                        </span>
                      </div>
                    </div>

                    {selectedUser.notes && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm bg-base-200 p-3 rounded-lg italic">
                          {selectedUser.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="btn btn-ghost"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setShowEditModal(true);
                    }}
                    className="btn btn-primary"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal ajout utilisateur */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Nouvel utilisateur</h2>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Jean Kouamé"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="input input-bordered w-full"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <input
                      type="tel"
                      className="input input-bordered w-full"
                      placeholder="+225 01 23 45 67"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rôle</label>
                      <select className="select select-bordered w-full">
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Statut</label>
                      <select className="select select-bordered w-full">
                        <option value="active">Actif</option>
                        <option value="pending">En attente</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mot de passe temporaire</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        value="Temp123!"
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-accent"
                        onClick={() => {
                          navigator.clipboard.writeText('Temp123!');
                          toast.success('Mot de passe copié');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-base-content/50 mt-1">
                      L'utilisateur devra changer ce mot de passe à la première connexion
                    </p>
                  </div>
                </form>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-ghost"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      toast.success('Utilisateur créé avec succès');
                      setShowAddModal(false);
                    }}
                    className="btn btn-primary"
                  >
                    <UserPlus className="w-4 h-4" />
                    Créer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;