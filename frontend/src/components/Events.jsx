import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { jsPDF } from "jspdf";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Title from "./Title";

const Events = () => {
  const [posts, setPosts] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const API_POSTS = "http://localhost:3000/posts";
  const postsPerPage = 4;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await axios.get(API_POSTS);
        setPosts(res.data);
        toast.success("Événements chargés !");
      } catch (error) {
        toast.error("Erreur de chargement");
      }
    };
    loadPosts();
  }, []);

  const filteredPosts = posts
    .filter((p) => filterType === "all" || p.type === filterType)
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const exportPDF = (post) => {
    const doc = new jsPDF();
    doc.text(post.title, 10, 20);
    doc.text(post.content, 10, 30);
    doc.save(`${post.title}.pdf`);
    toast.success("PDF téléchargé !");
  };

  return (
    <>
    <NavBar />
      <Toaster position="top-right" />

      <div className="p-5 md:px-[5%]">

        <div className="my-10 md:my-20">
          <Title title="Nos Événements" />
        </div>

        {/* Recherche */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Rechercher..."
            className="input input-bordered w-full max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          {["all", "message", "news", "verse"].map((t) => (
            <button
              key={t}
              className={`btn ${
                filterType === t ? "btn-accent" : "btn-ghost"
              }`}
              onClick={() => {
                setFilterType(t);
                setCurrentPage(1);
              }}
            >
              {t === "all"
                ? "Tous"
                : t === "message"
                ? "Messages"
                : t === "news"
                ? "Nouvelles"
                : "Versets"}
            </button>
          ))}
        </div>

        {/* Liste animée */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {currentPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="bg-base-100 p-6 rounded-2xl shadow-md hover:shadow-2xl cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <span className="badge badge-accent capitalize">
                  {post.type}
                </span>
              </div>

              <p className="line-clamp-3 opacity-80">
                {post.content}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  exportPDF(post);
                }}
                className="btn btn-sm btn-outline mt-4"
              >
                Exporter PDF
              </button>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-10">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-accent" : "btn-ghost"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>

      {/* Modal animé */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-base-100 p-6 rounded-2xl max-w-lg w-full relative"
          >
            <button
              className="btn btn-sm btn-circle absolute right-3 top-3"
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-3">
              {selectedPost.title}
            </h2>

            <p>{selectedPost.content}</p>
          </motion.div>
        </motion.div>
      )}

     <Footer/>
    </>
  );
};

export default Events;