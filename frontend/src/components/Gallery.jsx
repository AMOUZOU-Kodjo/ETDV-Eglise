import React, { useState, useEffect } from "react";
import {
  Image,
  Video,
  Music,
  Download,
  Calendar,
  Eye,
  X,
  Maximize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Film,
  Headphones,
  Camera,
} from "lucide-react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Gallery = () => {

  
  const [activeTab, setActiveTab] = useState("photos");
  const [mediaItems, setMediaItems] = useState({
    photos: [],
    videos: [],
    audios: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);

  // Charger les données depuis localStorage
  useEffect(() => {
    const loadMedia = () => {
      const savedMedia = localStorage.getItem("galleryMedia");
      if (savedMedia) {
        setMediaItems(JSON.parse(savedMedia));
      }
    };

    loadMedia();
    window.addEventListener("storage", loadMedia);
    return () => window.removeEventListener("storage", loadMedia);
  }, []);

  // Mettre à jour l'index courant
  useEffect(() => {
    if (selectedItem) {
      const index = mediaItems[activeTab].findIndex(
        (item) => item.id === selectedItem.id,
      );
      setCurrentIndex(index);
    }
  }, [selectedItem, activeTab, mediaItems]);

  // Empêcher le scroll du body
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  // Navigation entre les médias
  const navigateMedia = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < mediaItems[activeTab].length) {
      setCurrentIndex(newIndex);
      setSelectedItem(mediaItems[activeTab][newIndex]);
    }
  };

  // Gestion du plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  // Téléchargement
  const handleDownload = (item, e) => {
    e?.stopPropagation();
    const newMedia = { ...mediaItems };
    const index = newMedia[activeTab].findIndex((i) => i.id === item.id);
    if (index !== -1) {
      newMedia[activeTab][index].telechargements++;
      localStorage.setItem("galleryMedia", JSON.stringify(newMedia));
      setMediaItems(newMedia);

      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.titre;
      link.click();
    }
  };

  // Ouvrir le plein écran
  const openFullscreen = (item) => {
    setSelectedItem(item);
  };

  // Fermer le plein écran
  const closeFullscreen = () => {
    setSelectedItem(null);
  };

  // Jouer un audio
  const playAudio = (item, e) => {
    e?.stopPropagation();
    if (playingAudio === item.id) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(item.id);
    }
  };

  // Rendu du lecteur plein écran
  const renderFullscreen = () => {
    if (!selectedItem) return null;

    return (
      
      <div
        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
        onClick={closeFullscreen}
      >
        <div
          className="relative w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation */}
          {currentIndex > 0 && (
            <button
              onClick={() => navigateMedia(-1)}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary btn-sm sm:btn-md z-10"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          )}

          {currentIndex < mediaItems[activeTab].length - 1 && (
            <button
              onClick={() => navigateMedia(1)}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary btn-sm sm:btn-md z-10"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* En-tête */}
          <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-black/70 to-transparent p-2 sm:p-4 z-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-white flex-1 min-w-0">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold truncate">
                  {selectedItem.titre}
                </h2>
                <p className="text-xs sm:text-sm opacity-80 line-clamp-1">
                  {selectedItem.description}
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={(e) => handleDownload(selectedItem, e)}
                  className="btn btn-primary btn-xs sm:btn-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Télécharger</span>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="btn btn-secondary btn-xs sm:btn-sm"
                >
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm hidden sm:inline">
                    {fullscreen ? "Quitter" : "Plein écran"}
                  </span>
                </button>
                <button
                  onClick={closeFullscreen}
                  className="btn btn-ghost btn-xs sm:btn-sm text-white"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            {activeTab === "photos" && (
              <img
                src={selectedItem.url}
                alt={selectedItem.titre}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {activeTab === "videos" && (
              <div className="w-full h-full">
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Votre navigateur ne supporte pas la vidéo
                </video>
              </div>
            )}

            {activeTab === "audios" && (
              <div className="max-w-4xl w-full mx-auto text-center p-4">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8">
                  <div className="absolute inset-0 bg-linear-to-r from-green-500 to-teal-500 rounded-full animate-pulse"></div>
                  <Headphones className="w-16 h-16 sm:w-20 sm:h-20 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <audio
                  controls
                  autoPlay
                  className="w-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={selectedItem.url} type="audio/mpeg" />
                  Votre navigateur ne supporte pas l'audio
                </audio>
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2 sm:p-4">
            <div className="text-white text-xs sm:text-sm">
              {currentIndex + 1} / {mediaItems[activeTab].length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour obtenir la bannière
  const getMediaBanner = (type) => {
    const banners = {
      photos: {
        icon: Camera,
        gradient: "from-blue-600/20 to-purple-600/20",
        iconColor: "text-blue-500",
      },
      videos: {
        icon: Film,
        gradient: "from-red-600/20 to-orange-600/20",
        iconColor: "text-red-500",
      },
      audios: {
        icon: Headphones,
        gradient: "from-green-600/20 to-teal-600/20",
        iconColor: "text-green-500",
      },
    };

    const banner = banners[type];
    const Icon = banner.icon;

    return (
      <div
        className={`absolute inset-0 bg-linear-to-br ${banner.gradient} flex items-center justify-center`}
      >
        <Icon
          className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${banner.iconColor} opacity-50`}
        />
      </div>
    );
  };

  return (
    <><NavBar />
    <div className="p-3 sm:p-5 md:px-[5%] bg-base-100 min-h-screen">
      {/* En-tête */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
          Notre Galerie
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Découvrez les moments forts de notre communauté à travers photos,
          vidéos et enseignements audio
        </p>
      </div>

      {/* Onglets de navigation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
        <button
          onClick={() => setActiveTab("photos")}
          className={`btn ${activeTab === "photos" ? "btn-primary" : "btn-outline"} btn-sm sm:btn-md lg:btn-lg flex items-center gap-1 sm:gap-2`}
        >
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">
            Photos ({mediaItems.photos?.length || 0})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`btn ${activeTab === "videos" ? "btn-primary" : "btn-outline"} btn-sm sm:btn-md lg:btn-lg flex items-center gap-1 sm:gap-2`}
        >
          <Film className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">
            Vidéos ({mediaItems.videos?.length || 0})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("audios")}
          className={`btn ${activeTab === "audios" ? "btn-primary" : "btn-outline"} btn-sm sm:btn-md lg:btn-lg flex items-center gap-1 sm:gap-2`}
        >
          <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">
            Audios ({mediaItems.audios?.length || 0})
          </span>
        </button>
      </div>

      {/* Grille des médias avec aperçu direct */}
      <div className="mt-6 sm:mt-8">
        {mediaItems[activeTab]?.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500">
              Aucun {activeTab} disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {mediaItems[activeTab]?.map((item) => (
              <div
                key={item.id}
                className="bg-base-200 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Aperçu direct selon le type */}
                <div
                  className="relative h-48 sm:h-56 lg:h-64 overflow-hidden cursor-pointer"
                  onClick={() => openFullscreen(item)}
                >
                  {activeTab === "photos" && (
                    <>
                      <img
                        src={item.url}
                        alt={item.titre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Overlay avec titre au survol */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg truncate">
                            {item.titre}
                          </h3>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "videos" && (
                    <div className="relative w-full h-full">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      >
                        Votre navigateur ne supporte pas la vidéo
                      </video>
                      {/* Overlay play */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      {/* Badge durée */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        03:45
                      </div>
                    </div>
                  )}

                  {activeTab === "audios" && (
                    <div className="relative w-full h-full bg-gradient-to-br from-green-600/30 to-teal-600/30">
                      {/* Visualisation audio */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-end space-x-1 h-24">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 bg-green-500 rounded-t-full transition-all duration-300 ${playingAudio === item.id ? "animate-pulse" : ""
                                }`}
                              style={{
                                height: `${Math.sin(i * 0.5) * 30 + 40}%`,
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Contrôles audio */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(item, e);
                          }}
                          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          {playingAudio === item.id ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </button>
                      </div>

                      {/* Badge audio */}
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Headphones className="w-3 h-3" />
                        <span>Audio</span>
                      </div>

                      {/* Durée */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        05:30
                      </div>
                    </div>
                  )}

                  {/* Badge de type (pour photos) */}
                  {activeTab === "photos" && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>Photo</span>
                    </div>
                  )}
                </div>

                {/* Informations compactes */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm truncate flex-1">
                      {item.titre}
                    </h3>
                    <button
                      onClick={(e) => handleDownload(item, e)}
                      className="btn btn-xs btn-circle btn-ghost text-primary hover:bg-primary/20"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(item.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <span>{item.telechargements} téléchargements</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lecteur audio flottant quand un audio est joué */}
      {playingAudio && (
        <div className="fixed bottom-0 left-0 right-0 bg-base-200 border-t shadow-lg p-3 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-green-500" />
              <span className="font-medium text-sm">
                {mediaItems.audios.find((a) => a.id === playingAudio)?.titre}
              </span>
            </div>
            <audio
              controls
              autoPlay
              className="w-96"
              onEnded={() => setPlayingAudio(null)}
            >
              <source
                src={mediaItems.audios.find((a) => a.id === playingAudio)?.url}
                type="audio/mpeg"
              />
            </audio>
            <button
              onClick={() => setPlayingAudio(null)}
              className="btn btn-sm btn-ghost btn-circle"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Plein écran */}
      {renderFullscreen()}
    </div>
    <Footer/>
    </>
  );
};

export default Gallery;
