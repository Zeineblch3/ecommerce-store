"use client";

import { useState, useEffect } from "react";

export default function AddToFavoritesButton({ productId }) {
  const [isFavori, setIsFavori] = useState(false);

  // Optionnel : vérifier si le produit est déjà en favori
  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch("/api/favorites");
      if (!res.ok) return;
      const data = await res.json();
      if (data.some(f => f.productId === Number(productId))) {
        setIsFavori(true);
      }
    }
    fetchFavorites();
  }, [productId]);

  const handleAdd = async () => {
    if (isFavori) return; // déjà ajouté
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: Number(productId) }),
      });
      if (!res.ok) throw new Error("Impossible d'ajouter aux favoris");
      setIsFavori(true);
      alert("Produit ajouté aux favoris !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout aux favoris");
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isFavori}
      className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition ${
        isFavori
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      {isFavori ? "Déjà en favoris" : "Ajouter aux favoris"}
    </button>
  );
}