import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '../lib/api'; // API externe
import prisma from '../lib/prisma.js'; // Base de données

export const metadata = {
  title: 'Tous nos Produits | E-Commerce Store',
  description: 'Découvrez notre catalogue complet de produits de qualité',
};

export default async function ProductsPage() {
  // Fetch produits API
  const apiProducts = await getAllProducts();

  // Fetch produits base de données
  const dbProducts = await prisma.product.findMany({
    include: { category: true },
  });

  // Transformer les produits DB pour matcher la structure API
  const dbProductsFormatted = dbProducts.map(p => ({
    id: `db-${p.id}`, // pour éviter conflit d'ID
    title: p.title,
    description: p.description,
    price: p.price,
    image: p.image,
    category: p.category.name,
    rating: {
      rate: p.ratingRate,
      count: p.ratingCount,
    },
  }));

  // Combiner les deux sources
  const products = [...dbProductsFormatted, ...apiProducts];

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Nos Produits</h1>
        <p className="text-xl text-gray-600">{products.length} produits disponibles</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="relative h-64 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              <div className="p-4">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2 uppercase">
                  {product.category}
                </span>

                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h2>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.round(product.rating.rate))}
                    {'☆'.repeat(5 - Math.round(product.rating.rate))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.rating.count})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">Voir détails</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
