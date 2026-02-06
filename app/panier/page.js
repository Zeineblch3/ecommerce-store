// app/panier/page.js
import prisma from '@/app/lib/prisma.js';
import CartList from './CartList';
import Link from 'next/link';

export default async function CartPage() {
  // Récupérer les items du panier côté serveur
  const cartItems = await prisma.cartItem.findMany({
    include: { product: true }, // inclure les infos produit
  });

  // Formater pour le client
  const formattedItems = cartItems.map(item => ({
    id: item.id,
    product: {
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      image: item.product.image,
    },
    quantity: item.quantity,
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

      <CartList initialItems={formattedItems} />

      <div className="mt-8">
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Retour aux produits
        </Link>
      </div>
    </div>
  );
}
