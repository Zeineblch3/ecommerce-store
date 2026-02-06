'use client';

import { useRouter } from 'next/navigation';

export default function AddToCartButton({ productId }) {
  const router = useRouter();

  const handleAdd = async () => {
    await fetch('/api/panier', {
      method: 'POST',
      body: JSON.stringify({ productId }),
      headers: { 'Content-Type': 'application/json' },
    });
    router.push('/panier'); // redirige vers le panier
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
    >
      Ajouter au panier
    </button>
  );
}
