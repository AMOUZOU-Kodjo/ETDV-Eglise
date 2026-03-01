import { useState, useEffect } from "react";
import axios from "axios";
import NavBarAdmin from "./NavBarAdmin";

export default function AdminDashboard({ token, setToken }) {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    mediaUrl: "",
  });

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:3001/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:3001/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setForm({ ...form, mediaUrl: res.data.mediaUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3001/posts",
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setForm({ title: "", description: "", mediaUrl: "" });
    fetchPosts();
  };

  const deletePost = async (id) => {
    await axios.delete(
      `http://localhost:3001/posts/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPosts();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <><NavBarAdmin/>  
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <button onClick={logout} className="btn btn-error">
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-10">
        <input
          type="text"
          placeholder="Titre"
          className="input input-bordered w-full mb-4"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-4"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="file"
          className="file-input w-full mb-4"
          onChange={handleUpload}
        />

        <button className="btn btn-accent w-full">
          Publier
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <figure>
              {post.mediaUrl && (
                <img src={post.mediaUrl} alt="" />
              )}
            </figure>
            <div className="card-body">
              <h2 className="card-title">{post.title}</h2>
              <p>{post.description}</p>
              <button
                onClick={() => deletePost(post.id)}
                className="btn btn-error btn-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}