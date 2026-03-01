import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Image, Video, Music, Download, X } from 'lucide-react';
import NavBarAdmin from './NavBarAdmin';

const AdminGallery = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [mediaItems, setMediaItems] = useState({
    photos: [],
    videos: [],
    audios: []
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    titre: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    fichier: null,
    previewUrl: ''
  });

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedMedia = localStorage.getItem('galleryMedia');
    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia));
    }
  }, []);

  // Sauvegarder les données
  const saveMedia = (newMedia) => {
    localStorage.setItem('galleryMedia', JSON.stringify(newMedia));
    setMediaItems(newMedia);
  };

  // Convertir un fichier en Data URL
  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Ajouter un média
  const handleAddMedia = async () => {
    if (newItem.titre && newItem.fichier) {
      try {
        // Convertir le fichier en Data URL
        const dataUrl = await fileToDataUrl(newItem.fichier);
        
        const newMedia = { ...mediaItems };
        const itemWithId = {
          id: Date.now(),
          titre: newItem.titre,
          description: newItem.description,
          url: dataUrl, // Stocker la Data URL
          date: newItem.date,
          type: newItem.fichier.type,
          nomFichier: newItem.fichier.name,
          taille: newItem.fichier.size,
          telechargements: 0
        };
        
        newMedia[activeTab].push(itemWithId);
        saveMedia(newMedia);
        setShowAddForm(false);
        setNewItem({
          titre: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          fichier: null,
          previewUrl: ''
        });
      } catch (error) {
        alert('Erreur lors du chargement du fichier');
      }
    } else {
      alert('Veuillez remplir le titre et sélectionner un fichier');
    }
  };

  // Modifier un média
  const handleEditMedia = async () => {
    if (editingItem.titre) {
      const newMedia = { ...mediaItems };
      const index = newMedia[activeTab].findIndex(item => item.id === editingItem.id);
      if (index !== -1) {
        // Si un nouveau fichier a été sélectionné
        if (editingItem.newFile) {
          const dataUrl = await fileToDataUrl(editingItem.newFile);
          editingItem.url = dataUrl;
          editingItem.nomFichier = editingItem.newFile.name;
          editingItem.taille = editingItem.newFile.size;
          delete editingItem.newFile;
        }
        
        newMedia[activeTab][index] = editingItem;
        saveMedia(newMedia);
        setEditingItem(null);
      }
    }
  };

  // Supprimer un média
  const handleDeleteMedia = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      const newMedia = { ...mediaItems };
      newMedia[activeTab] = newMedia[activeTab].filter(item => item.id !== id);
      saveMedia(newMedia);
    }
  };

  // Gérer la sélection de fichier
  const handleFileChange = (e, isEditing = false, item = null) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const fileType = file.type.split('/')[0];
      let isValid = false;
      
      switch(activeTab) {
        case 'photos':
          isValid = fileType === 'image';
          break;
        case 'videos':
          isValid = fileType === 'video';
          break;
        case 'audios':
          isValid = fileType === 'audio';
          break;
      }
      
      if (!isValid) {
        alert(`Veuillez sélectionner un fichier ${activeTab === 'photos' ? 'image' : activeTab === 'videos' ? 'vidéo' : 'audio'} valide`);
        return;
      }
      
      if (isEditing && item) {
        setEditingItem({...item, newFile: file});
      } else {
        setNewItem({...newItem, fichier: file});
      }
    }
  };

  return (
    <><NavBarAdmin/> 
    <div className=" bg-base-100 min-h-screen p-5 md:px-[5%] ">
      <div className="flex justify-between items-center m-8 ">
        <h1 className="text-3xl font-bold ">Administration de la Galerie</h1>
      </div>
      
      {/* Onglets d'administration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('photos')}
          className={`btn ${activeTab === 'photos' ? 'btn-primary' : 'btn-outline btn-primary'} flex items-center gap-2`}
        >
          <Image className="w-5 h-5" />
          Photos ({mediaItems.photos?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`btn ${activeTab === 'videos' ? 'btn-primary' : 'btn-outline btn-primary'} flex items-center gap-2`}
        >
          <Video className="w-5 h-5" />
          Vidéos ({mediaItems.videos?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('audios')}
          className={`btn ${activeTab === 'audios' ? 'btn-primary' : 'btn-outline btn-primary'} flex items-center gap-2`}
        >
          <Music className="w-5 h-5" />
          Audios ({mediaItems.audios?.length || 0})
        </button>
      </div>

      {/* Bouton d'ajout */}
      <button
        onClick={() => setShowAddForm(true)}
        className="btn btn-secondary mb-6 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Ajouter {activeTab}
      </button>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ajouter {activeTab}</h2>
            <button onClick={() => setShowAddForm(false)} className="btn btn-ghost btn-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Titre"
              value={newItem.titre}
              onChange={(e) => setNewItem({...newItem, titre: e.target.value})}
              className="input input-bordered"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="input input-bordered"
            />
            <input
              type="date"
              value={newItem.date}
              onChange={(e) => setNewItem({...newItem, date: e.target.value})}
              className="input input-bordered"
            />
            <input
              type="file"
              accept={
                activeTab === 'photos' ? 'image/*' : 
                activeTab === 'videos' ? 'video/*' : 
                'audio/*'
              }
              onChange={handleFileChange}
              className="file-input file-input-bordered col-span-2"
            />
            {newItem.fichier && (
              <div className="col-span-2 text-sm text-gray-500">
                Fichier sélectionné : {newItem.fichier.name}
              </div>
            )}
            <button onClick={handleAddMedia} className="btn btn-primary col-span-2">
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Formulaire d'édition */}
      {editingItem && (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Modifier</h2>
            <button onClick={() => setEditingItem(null)} className="btn btn-ghost btn-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={editingItem.titre}
              onChange={(e) => setEditingItem({...editingItem, titre: e.target.value})}
              className="input input-bordered"
            />
            <input
              type="text"
              value={editingItem.description}
              onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
              className="input input-bordered"
            />
            <input
              type="date"
              value={editingItem.date}
              onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
              className="input input-bordered"
            />
            <input
              type="file"
              accept={
                activeTab === 'photos' ? 'image/*' : 
                activeTab === 'videos' ? 'video/*' : 
                'audio/*'
              }
              onChange={(e) => handleFileChange(e, true, editingItem)}
              className="file-input file-input-bordered col-span-2"
            />
            <button onClick={handleEditMedia} className="btn btn-primary col-span-2">
              <Save className="w-5 h-5 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* Liste des médias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems[activeTab]?.map((item) => (
          <div key={item.id} className="bg-base-200 p-4 rounded-xl shadow-lg">
            {activeTab === 'photos' && (
              <img 
                src={item.url} 
                alt={item.titre} 
                className="w-full h-48 object-cover rounded-lg mb-4" 
              />
            )}
            {activeTab === 'videos' && (
              <video 
                src={item.url} 
                className="w-full h-48 object-cover rounded-lg mb-4" 
                controls
              />
            )}
            {activeTab === 'audios' && (
              <div className="w-full h-48 bg-base-300 rounded-lg mb-4 flex items-center justify-center">
                <Music className="w-12 h-12 text-primary" />
              </div>
            )}
            
            <h3 className="font-bold text-lg">{item.titre}</h3>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <p className="text-xs text-gray-400 mb-2">Ajouté le: {item.date}</p>
            <p className="text-xs text-gray-400 mb-2">Fichier: {item.nomFichier}</p>
            <p className="text-xs text-accent mb-4">{item.telechargements} téléchargements</p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = item.url;
                  link.download = item.nomFichier || item.titre;
                  link.click();
                  
                  // Incrémenter le compteur
                  const newMedia = { ...mediaItems };
                  const index = newMedia[activeTab].findIndex(i => i.id === item.id);
                  if (index !== -1) {
                    newMedia[activeTab][index].telechargements++;
                    saveMedia(newMedia);
                  }
                }}
                className="btn btn-sm btn-primary"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingItem(item)}
                className="btn btn-sm btn-warning"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteMedia(item.id)}
                className="btn btn-sm btn-error"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
     </>
  );
};

export default AdminGallery;