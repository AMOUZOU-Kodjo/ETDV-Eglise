import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Title from "./Title";

const Events = () => {
  const [posts, setPosts] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const API_POSTS = "http://localhost:3001/posts";

  useEffect(() => {
    const loadPosts = async () => {
      const res = await axios.get(API_POSTS);
      setPosts(res.data);
    };
    loadPosts();
  }, []);

  const filteredPosts =
    filterType === "all" ? posts : posts.filter((p) => p.type === filterType);

  return (
    <div className="p-5 md:px-[5%]">
      
      <div className="my-10 md:my-20">
        <Title title="Nos Événements" />
      </div>

      {/* FILTRE POSTS */}
      <div className="flex gap-4 mb-6 justify-center flex-wrap">
        {["all", "message", "news", "verse"].map((t) => (
          <button
            key={t}
            className={`btn ${filterType === t ? "btn-accent" : "btn-ghost"}`}
            onClick={() => setFilterType(t)}
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

      {/* LISTE POSTS */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-base-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <span className="badge badge-primary capitalize">{post.type}</span>
            </div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Events;