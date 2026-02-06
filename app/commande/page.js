"use client";

import { useEffect, useState } from "react";

export default function OrdersCRUD() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/commande");
        if (!res.ok) throw new Error("Erreur lors du chargement des commandes");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette commande ?")) return;

    const res = await fetch(`/api/commande/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Impossible de supprimer");

    setOrders(orders.filter((o) => o.id !== id));
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
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-10">
          Gestion des commandes
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400">Aucune commande pour le moment.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-gray-800">
                    Commande #{order.id} - {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center bg-white p-2 rounded-md border"
                    >
                      <p className="font-medium">{item.product.title}</p>
                      <p>
                        {item.quantity} × {item.price} € = {(item.quantity * item.price).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-3 font-semibold text-gray-700">
                  Total : {order.total.toFixed(2)} €
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
