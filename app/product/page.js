"use client";

import { useEffect, useState } from "react";

export default function ProductsCRUD() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    ratingRate: "",
    ratingCount: "",
    image: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (!productsRes.ok || !categoriesRes.ok)
          throw new Error("Erreur chargement données");

        setProducts(await productsRes.json());
        setCategories(await categoriesRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* --------- ADD --------- */
  const handleAdd = async () => {
  console.log(form);
  if (!form.title || !form.price || !form.categoryId || !form.image) {
    console.log("Formulaire incomplet !");
    return;
  }

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      ratingRate: Number(form.ratingRate || 0),
      ratingCount: Math.floor(Number(form.ratingCount) || 0),
      image: form.image,
    }),
  });

  if (!res.ok) return;

  const added = await res.json();
  setProducts([...products, added]);
  setForm({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    ratingRate: "",
    ratingCount: "",
    image: "",
  });
};


  /* --------- UPDATE --------- */
  const handleUpdate = async (id, field, value) => {
    if (field === "title" && !value.trim()) return;

    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id), [field]: value }),
    });

    if (!res.ok) return;

    const updated = await res.json();
    setProducts(products.map((p) => (p.id === id ? updated : p)));
  };

  /* --------- DELETE --------- */
  const handleDelete = async (id) => {
    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id) }),
    });
    if (!res.ok) return;
    setProducts(products.filter((p) => p.id !== id));
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
          Gestion des produits
        </h1>

        {/* Ajout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <input
            type="text"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Prix"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full sm:col-span-2 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.1"
            placeholder="Rating rate"
            value={form.ratingRate}
            onChange={(e) => setForm({ ...form, ratingRate: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Rating count"
            value={form.ratingCount}
            onChange={(e) => setForm({ ...form, ratingCount: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="URL image"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full sm:col-span-2 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {form.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.image}
              alt="Aperçu"
              className="w-64 h-64 object-cover border rounded mt-2 sm:col-span-2"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        <button
          onClick={handleAdd}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition mb-10"
        >
          Ajouter
        </button>

        {/* Liste */}
        {products.length === 0 ? (
          <p className="text-center text-gray-400">Aucun produit pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="group bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <input
                  type="text"
                  defaultValue={p.title}
                  onBlur={(e) => handleUpdate(p.id, "title", e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <textarea
                  defaultValue={p.description}
                  onBlur={(e) => handleUpdate(p.id, "description", e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="number"
                  defaultValue={p.price}
                  onBlur={(e) => handleUpdate(p.id, "price", Number(e.target.value))}
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <select
                  defaultValue={p.categoryId}
                  onBlur={(e) =>
                    handleUpdate(p.id, "categoryId", Number(e.target.value))
                  }
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={p.ratingRate}
                  onBlur={(e) =>
                    handleUpdate(p.id, "ratingRate", Number(e.target.value))
                  }
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="number"
                  defaultValue={p.ratingCount}
                  onBlur={(e) =>
                    handleUpdate(p.id, "ratingCount", Number(e.target.value))
                  }
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="text"
                  defaultValue={p.image}
                  onBlur={(e) => handleUpdate(p.id, "image", e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1 mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt="Aperçu"
                    className="w-full h-48 object-cover border rounded mb-2"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-sm text-red-500 hover:text-red-600 transition mt-2"
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
