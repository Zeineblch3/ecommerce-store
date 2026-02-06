"use client";

import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Récupérer les favoris */
  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Erreur chargement favoris");
      setFavorites(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  /* Retirer un favori */
  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Impossible de supprimer");
      setFavorites(favorites.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement…
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-10">
          Mes Favoris
        </h1>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-400">Aucun favori pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((f) => (
              <div
                key={f.id}
                className="group bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={f.product.image}
                  alt={f.product.title}
                  className="w-full h-48 object-cover border rounded mb-2"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {f.product.title}
                </h2>
                <p className="text-gray-600 mb-2">{f.product.description}</p>
                <p className="text-gray-800 font-medium mb-2">{f.product.price} DT</p>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="text-sm text-red-500 hover:text-red-600 transition"
                >
                  Retirer des favoris
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}