// src/components/Dashboard/StatsCards.jsx
import React from "react";
import { motion } from "framer-motion";

const StatsCards = ({ stats }) => {
  const cards = [
    { label: "Total", value: stats.total, color: "bg-blue-500" },
    { label: "Images", value: stats.images, color: "bg-green-500" },
    { label: "Vidéos", value: stats.videos, color: "bg-red-500" },
    { label: "Audios", value: stats.audios, color: "bg-purple-500" },
    { label: "Téléchargements", value: stats.totalDownloads, color: "bg-orange-500" },
    { label: "Vues", value: stats.totalViews, color: "bg-indigo-500" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
        >
          <p className="text-sm text-gray-500 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color} text-transparent bg-clip-text bg-gradient-to-r ${card.color}`}>
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;