// pages/MediaPage.jsx (suite)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// MediaPage.jsx - CORRECTION DES IMPORTS
import {
  Film,
  Music,
  Search,
  Filter,
  Grid3x3,
  List,
  Clock,
  TrendingUp,
  Star,
  PlayCircle,
  Headphones,
  // Correction: Ces noms peuvent être différents
  Youtube,  // Vérifiez si 'Youtube' ou 'YouTube'
  // Soundcloud, // Peut-être 'Soundcloud' n'existe pas
  // Apple, // Peut-être 'Apple' n'existe pas
  // Spotify, // Vérifiez si 'Spotify' existe
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Heart,
  MoreVertical,
  Calendar,
  Eye,
  User,
  Tag,
  Play,
  Pause,
  X
} from 'lucide-react';
import VideoPlayer from '../components/media/VideoPlayer';
import AudioPlayer from '../components/media/AudioPlayer';

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);

  // Données simulées
  const videos = [
    {
      id: 'v1',
      title: 'Enseignement sur la foi - Pasteur Jean',
      description: 'Découvrez les fondements de la foi chrétienne à travers les Écritures',
      channel: 'Pasteur Jean',
      channelAvatar: '/channel-1.jpg',
      views: '15.2k',
      likes: '1.2k',
      date: '2024-03-15',
      duration: '45:30',
      thumbnail: 'https://img.youtube.com/vi/YnCuqwnhS0k/maxresdefault.jpg',
      category: 'Enseignement',
      tags: ['foi', 'bible', 'enseignement']
    },
    {
      id: 'v2',
      title: 'Louange et Adoration - Session live',
      description: 'Un moment de louange et d\'adoration avec la chorale',
      channel: 'Chorale ETDV',
      channelAvatar: '/channel-2.jpg',
      views: '8.7k',
      likes: '956',
      date: '2024-03-12',
      duration: '32:15',
      thumbnail: 'https://img.youtube.com/vi/YnCuqwnhS0k/maxresdefault.jpg',
      category: 'Louange',
      tags: ['louange', 'musique', 'adoration']
    },
    {
      id: 'v3',
      title: 'Étude biblique : La prière',
      description: 'Étude approfondie sur le thème de la prière',
      channel: 'Frère Marc',
      channelAvatar: '/channel-3.jpg',
      views: '6.3k',
      likes: '789',
      date: '2024-03-10',
      duration: '52:20',
      thumbnail: 'https://img.youtube.com/vi/YnCuqwnhS0k/maxresdefault.jpg',
      category: 'Étude biblique',
      tags: ['prière', 'étude', 'bible']
    }
  ];

  const audios = [
    {
      id: 'a1',
      title: 'Méditation du matin - La paix de Dieu',
      artist: 'Pasteur Marc',
      album: 'Méditations quotidiennes',
      plays: '12.5k',
      likes: '1.8k',
      duration: '28:30',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      category: 'Méditation',
      year: 2024,
      tags: ['méditation', 'paix', 'matin']
    },
    {
      id: 'a2',
      title: 'Enseignement : Les promesses de Dieu',
      artist: 'Pasteur Jean',
      album: 'Enseignements',
      plays: '9.8k',
      likes: '1.2k',
      duration: '45:20',
      cover: 'https://images.unsplash.com/photo-1446057032654-9d8885d76e4c?w=400',
      category: 'Enseignement',
      year: 2024,
      tags: ['promesses', 'dieu', 'enseignement']
    },
    {
      id: 'a3',
      title: 'Louange à l\'Éternel',
      artist: 'Chorale ETDV',
      album: 'Louanges Vol.1',
      plays: '21.3k',
      likes: '2.4k',
      duration: '32:15',
      cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
      category: 'Louange',
      year: 2024,
      tags: ['louange', 'gospel', 'chorale']
    }
  ];

  const categories = [
    'all',
    'Enseignement',
    'Louange',
    'Méditation',
    'Étude biblique',
    'Témoignage',
    'Jeunes'
  ];

  const filteredVideos = videos.filter(video => {
    if (selectedCategory !== 'all' && video.category !== selectedCategory) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.channel.toLowerCase().includes(searchLower) ||
        video.tags.some(tag => tag.includes(searchLower))
      );
    }
    return true;
  });

  const filteredAudios = audios.filter(audio => {
    if (selectedCategory !== 'all' && audio.category !== selectedCategory) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        audio.title.toLowerCase().includes(searchLower) ||
        audio.artist.toLowerCase().includes(searchLower) ||
        audio.album.toLowerCase().includes(searchLower) ||
        audio.tags.some(tag => tag.includes(searchLower))
      );
    }
    return true;
  });

  const formatNumber = (num) => {
    if (num.includes('k')) return num;
    return num;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hier';
    if (diffDays < 7) return `il y a ${diffDays} jours`;
    if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
    return d.toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Lecteur vidéo en plein écran */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black">
          <VideoPlayer
            video={selectedVideo}
            relatedVideos={videos.filter(v => v.id !== selectedVideo.id)}
            onVideoChange={setSelectedVideo}
          />
          <button
            onClick={() => setSelectedVideo(null)}
            className="fixed top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Lecteur audio flottant */}
      {selectedAudio && (
        <AudioPlayer
          playlist={audios}
          currentTrack={selectedAudio}
          onTrackChange={setSelectedAudio}
        />
      )}

      {/* En-tête */}
      <div className="bg-gradient-to-r from-accent/20 to-base-200 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Médiathèque
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Explorez nos vidéos, enseignements et musiques pour enrichir votre vie spirituelle
            </p>
          </motion.div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher une vidéo, un enseignement, une musique..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-12 py-3 text-lg"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-base-content/70 hover:text-accent transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-base-300">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-50">
                      <label className="block text-sm font-medium mb-2">
                        Catégorie
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat === 'all' ? 'Toutes les catégories' : cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 min-w-50">
                      <label className="block text-sm font-medium mb-2">
                        Trier par
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="recent">Plus récents</option>
                        <option value="popular">Plus populaires</option>
                        <option value="title">Titre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Onglets */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-accent text-white shadow-lg scale-105'
                : 'bg-base-200 hover:bg-base-300'
            }`}
          >
            <Film className="w-5 h-5" />
            <span>Vidéos</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {filteredVideos.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('audios')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'audios'
                ? 'bg-accent text-white shadow-lg scale-105'
                : 'bg-base-200 hover:bg-base-300'
            }`}
          >
            <Music className="w-5 h-5" />
            <span>Podcasts</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {filteredAudios.length}
            </span>
          </button>

          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-accent text-white' : 'bg-base-200 hover:bg-base-300'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-accent text-white' : 'bg-base-200 hover:bg-base-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grille des vidéos */}
        {activeTab === 'videos' && (
          <motion.div
            key="videos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-6 pb-20`}
          >
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group cursor-pointer ${
                  viewMode === 'list' ? 'flex gap-4' : ''
                }`}
                onClick={() => setSelectedVideo(video)}
              >
                {/* Miniature */}
                <div className={`relative ${
                  viewMode === 'list' ? 'w-64 shrink-0' : 'w-full'
                }`}>
                  <div className="aspect-video rounded-xl overflow-hidden bg-base-300">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  {/* Badge durée */}
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                    {video.duration}
                  </span>

                  {/* Badge catégorie */}
                  <span className="absolute top-2 left-2 px-2 py-1 bg-accent text-white text-xs rounded">
                    {video.category}
                  </span>
                </div>

                {/* Infos vidéo */}
                <div className={`mt-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-2 text-sm text-base-content/50">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views} vues
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(video.date)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs">
                      {video.channel.charAt(0)}
                    </div>
                    <span className="text-sm hover:text-accent transition-colors">
                      {video.channel}
                    </span>
                  </div>

                  {viewMode === 'list' && (
                    <p className="mt-2 text-sm text-base-content/70 line-clamp-2">
                      {video.description}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-base-200 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Grille des audios */}
        {activeTab === 'audios' && (
          <motion.div
            key="audios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-6 pb-32`}
          >
            {filteredAudios.map((audio, index) => (
              <motion.div
                key={audio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group cursor-pointer ${
                  viewMode === 'list' ? 'flex gap-4' : ''
                }`}
                onClick={() => setSelectedAudio(audio)}
              >
                {/* Pochette album */}
                <div className={`relative ${
                  viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'w-full aspect-square'
                }`}>
                  <div className="w-full h-full rounded-xl overflow-hidden bg-base-300">
                    <img
                      src={audio.cover}
                      alt={audio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {playingAudio === audio.id ? (
                        <PauseCircle className="w-12 h-12 text-white" />
                      ) : (
                        <PlayCircle className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Badge durée */}
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                    {audio.duration}
                  </span>
                </div>

                {/* Infos audio */}
                <div className={`mt-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                    {audio.title}
                  </h3>
                  
                  <p className="text-sm text-base-content/70 mt-1">
                    {audio.artist} • {audio.album}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm text-base-content/50">
                    <div className="flex items-center gap-1">
                      <Headphones className="w-4 h-4" />
                      {audio.plays} écoutes
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {audio.likes}
                    </div>
                  </div>

                  {viewMode === 'list' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingAudio(playingAudio === audio.id ? null : audio.id);
                        }}
                        className="btn btn-accent btn-sm gap-2"
                      >
                        {playingAudio === audio.id ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Écouter
                          </>
                        )}
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {audio.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-base-200 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Message si aucun résultat */}
        {(activeTab === 'videos' && filteredVideos.length === 0) ||
         (activeTab === 'audios' && filteredAudios.length === 0) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold mb-2">Aucun résultat trouvé</h3>
            <p className="text-base-content/50">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;