import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminGallery from "./AdminGallery";
import AdminDashboard from "./AdminDashboard";

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("message");
  const [editId, setEditId] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const [media, setMedia] = useState([]);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("photo");
  const [editMediaId, setEditMediaId] = useState(null);
  const [filterMediaType, setFilterMediaType] = useState("all");

const API_POSTS = "http://localhost:3001/posts";
const API_MEDIA = "http://localhost:3001/media";

  // --- Charger posts et médias ---
  const loadPosts = async () => {
    const res = await axios.get(API_POSTS);
    setPosts(res.data);
  };

  const loadMedia = async () => {
    const res = await axios.get(API_MEDIA);
    setMedia(res.data);
  };

  useEffect(() => {
    loadPosts();
    loadMedia();
  }, []);

  // --- Posts CRUD ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editId) {
      await axios.put(`${API_POSTS}/${editId}`, { title, content, type });
      setEditId(null);
    } else {
      await axios.post(API_POSTS, { title, content, type });
    }

    setTitle(""); setContent(""); setType("message");
    loadPosts();
  };

  const handleDeletePost = async (id) => {
    await axios.delete(`${API_POSTS}/${id}`);
    loadPosts();
  };

  const handleEditPost = (post) => {
    setTitle(post.title); setContent(post.content); setType(post.type); setEditId(post.id);
  };

  const filteredPosts = filterType === "all" ? posts : posts.filter(p => p.type === filterType);

  // --- Media CRUD ---
  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    if (!mediaTitle || (!mediaFile && !editMediaId)) return;

    const formData = new FormData();
    formData.append("title", mediaTitle);
    formData.append("type", mediaType);
    if (mediaFile) formData.append("file", mediaFile);

    if (editMediaId) {
      await axios.put(`${API_MEDIA}/${editMediaId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setEditMediaId(null);
    } else {
      await axios.post(API_MEDIA, formData, { headers: { "Content-Type": "multipart/form-data" } });
    }

    setMediaTitle(""); setMediaFile(null); setMediaType("photo");
    loadMedia();
  };

  const handleDeleteMedia = async (id) => {
    await axios.delete(`${API_MEDIA}/${id}`);
    loadMedia();
  };

  const handleEditMedia = (m) => {
    setMediaTitle(m.title); setMediaFile(null); setMediaType(m.type); setEditMediaId(m.id);
  };

  const filteredMedia = filterMediaType === "all" ? media : media.filter(m => m.type === filterMediaType);

  return (
    <div className="p-5 md:px-[5%]">
      <h1 className="text-2xl font-bold mb-5">Dashboard Admin</h1>

      {/* POSTS */}
      <form onSubmit={handlePostSubmit} className="bg-base-200 p-5 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{editId ? "Modifier un post" : "Ajouter un post"}</h2>
        <input type="text" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} className="input input-bordered w-full mb-3"/>
        <textarea placeholder="Contenu" value={content} onChange={e => setContent(e.target.value)} className="textarea textarea-bordered w-full mb-3"/>
        <select value={type} onChange={e => setType(e.target.value)} className="select select-bordered w-full mb-3">
          <option value="message">Message du jour</option>
          <option value="news">Nouvelles</option>
          <option value="verse">Verset biblique</option>
        </select>
        <button type="submit" className="btn btn-accent">{editId ? "Modifier" : "Ajouter"}</button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {["all","message","news","verse"].map(t => (
          <button key={t} className={`btn ${filterType===t?"btn-accent":"btn-ghost"}`} onClick={()=>setFilterType(t)}>
            {t==="all"?"Tous":t==="message"?"Messages":t==="news"?"Nouvelles":"Versets"}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-base-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <span className="badge badge-primary capitalize">{post.type}</span>
            </div>
            <p>{post.content}</p>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-warning" onClick={()=>handleEditPost(post)}>Modifier</button>
              <button className="btn btn-sm btn-error" onClick={()=>handleDeletePost(post.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {/* MÉDIAS
      <form onSubmit={handleMediaSubmit} className="bg-base-200 p-5 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{editMediaId ? "Modifier un média" : "Ajouter un média"}</h2>
        <input type="text" placeholder="Titre du média" value={mediaTitle} onChange={e => setMediaTitle(e.target.value)} className="input input-bordered w-full mb-3"/>
        <input type="file" onChange={e => setMediaFile(e.target.files[0])} className="file-input w-full mb-3"/>
        <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="select select-bordered w-full mb-3">
          <option value="photo">Photo</option>
          <option value="audio">Audio</option>
          <option value="video">Vidéo</option>
        </select>
        <button type="submit" className="btn btn-accent">{editMediaId ? "Modifier" : "Ajouter Média"}</button>
      </form>

      <div className="flex gap-4 mb-6">
        {["all","photo","audio","video"].map(t => (
          <button key={t} className={`btn ${filterMediaType===t?"btn-accent":"btn-ghost"}`} onClick={()=>setFilterMediaType(t)}>
            {t==="all"?"Tous":t==="photo"?"Photos":t==="audio"?"Audios":"Vidéos"}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredMedia.map(m => (
          <div key={m.id} className="bg-base-100 p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {m.type==="photo" && <img src={m.url} alt={m.title} className="w-full h-60 object-cover rounded-lg"/>}
            {m.type==="audio" && <audio controls className="w-full"><source src={m.url} type="audio/mp3"/></audio>}
            {m.type==="video" && <video controls className="w-full rounded-lg"><source src={m.url} type="video/mp4"/></video>}
            <h3 className="text-lg font-bold mt-2">{m.title}</h3>
            <span className="badge badge-info capitalize">{m.type}</span>
            <div className="flex gap-2 mt-2">
              <button className="btn btn-sm btn-warning" onClick={()=>handleEditMedia(m)}>Modifier</button>
              <button className="btn btn-sm btn-error" onClick={()=>handleDeleteMedia(m.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div> */}
      <AdminGallery />
      <AdminDashboard />
    </div>
  );
};

export default Admin;