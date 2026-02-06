// app/panier/CardList.js
'use client';
import { useState } from 'react';

export default function CartList({ initialItems }) {

  const [cart, setCart] = useState(initialItems);

  // Supprimer un item
  const handleDelete = async (id) => {
    await fetch(`/api/panier/${id}`, { method: 'DELETE' });
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Mettre à jour la quantité
  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;

    // Optionnel : mettre à jour la DB côté serveur
    await fetch(`/api/panier/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity: newQty }),
      headers: { 'Content-Type': 'application/json' },
    });

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Ajouter un produit ou augmenter quantité si déjà présent
  const handleAdd = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { id: product.id, product, quantity}];
      }
    });
  };

  // Calculer le total
  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="space-y-6">
      {cart.length === 0 && <p>Votre panier est vide.</p>}

      {cart.map(item => (
        <div
          key={item.product.id} // éviter duplication
          className="flex flex-col md:flex-row items-center md:justify-between bg-white shadow p-4 rounded-lg"
        >
          {/* Image */}
          <img
            src={item.product.image}
            alt={item.product.title}
            className="w-24 h-24 object-contain mb-2 md:mb-0 md:mr-4"
          />

          {/* Infos */}
          <div className="flex-1 text-center md:text-left">
            <p className="font-semibold text-lg">{item.product.title}</p>
            <p className="text-gray-600">{item.product.price.toFixed(2)} €</p>

            {/* Choisir la quantité */}
            <div className="mt-2 flex justify-center md:justify-start items-center gap-2">
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                className="w-16 text-center border rounded px-2 py-1"
              />
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Supprimer */}
          <button
            className="text-red-600 hover:text-red-800 mt-2 md:mt-0"
            onClick={() => handleDelete(item.id)}
          >
            Supprimer
          </button>
        </div>
      ))}

      {/* Total */}
      {cart.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow flex flex-col md:flex-row justify-between items-center">
          <p className="text-xl font-semibold">Total : {total.toFixed(2)} €</p>
          <button
            onClick={async () => {
              await fetch('/api/commande', {
                method: 'POST',
                body: JSON.stringify({ items: cart }),
                headers: { 'Content-Type': 'application/json' },
              });
              setCart([]);
              alert('Commande passée !');
            }}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold"
          >
            Passer la commande
          </button>
        </div>
      )}
    </div>
  );
}
