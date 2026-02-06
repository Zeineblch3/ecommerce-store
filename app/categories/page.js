"use client";

import { useEffect, useState } from "react";

export default function CategoriesCRUD() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Erreur lors du chargement");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    if (!res.ok) return;

    const added = await res.json();
    setCategories([...categories, added]);
    setNewName("");
  };

  const handleUpdate = async (id, updatedName) => {
    if (!updatedName.trim()) return;

    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: updatedName }),
    });

    if (!res.ok) return;

    const updated = await res.json();
    setCategories(categories.map((c) => (c.id === id ? updated : c)));
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setCategories(categories.filter((c) => c.id !== id));
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-10">
          Gestion des catégories
        </h1>

        {/* Ajout */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom de la catégorie"
            className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Ajouter
          </button>
        </div>

        {/* Liste */}
        {categories.length === 0 ? (
          <p className="text-center text-gray-400">
            Aucune catégorie pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <input
                    type="text"
                    defaultValue={cat.name}
                    onBlur={(e) => handleUpdate(cat.id, e.target.value)}
                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
                />

                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-sm text-red-500 hover:text-red-600 transition"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
