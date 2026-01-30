import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getAllProducts } from '@/app/lib/api';

// Generer les routes statiques au build (SSG)
export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map(product => ({
    id: product.id.toString(), // Doit etre string
  }));
}

// Metadata dynamique (SEO)
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    return {
      title: `${product.title} | E-Commerce Store`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [product.image],
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Produit non trouve',
    };
  }
}

// Page produit
export default async function ProductPage({ params }) {
  const { id } = await params;
  let product;

  try {
    product = await getProductById(id);
  } catch (error) {
    // Si produit n'existe pas, afficher 404
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">Accueil</Link>
        {' > '}
        <Link href="/products" className="hover:text-blue-600">Produits</Link>
        {' > '}
        <span className="text-gray-900">{product.title}</span>
      </nav>

      {/* Layout 2 colonnes */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Colonne gauche : Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-8"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Colonne droite : Informations */}
        <div>
          {/* Badge categorie */}
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4 uppercase">
            {product.category}
          </span>

          {/* Titre */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400 text-2xl">
              {'★'.repeat(Math.round(product.rating.rate))}
              {'☆'.repeat(5 - Math.round(product.rating.rate))}
            </div>
            <span className="text-gray-600">
              {product.rating.rate} / 5
            </span>
            <span className="text-gray-500">
              ({product.rating.count} avis)
            </span>
          </div>

          {/* Prix */}
          <div className="mb-8">
            <span className="text-5xl font-bold text-blue-600">
              {product.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
              Ajouter au panier
            </button>

            <button className="w-full bg-gray-200 text-gray-800 px-8 py-4 rounded-lg hover:bg-gray-300 transition font-semibold text-lg">
              Ajouter aux favoris
            </button>
          </div>

          {/* Informations supplementaires */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Informations produit
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex">
                <dt className="font-semibold w-32">Categorie :</dt>
                <dd className="text-gray-600">{product.category}</dd>
              </div>
              <div className="flex">
                <dt className="font-semibold w-32">Prix :</dt>
                <dd className="text-gray-600">{product.price}</dd>
              </div>
              <div className="flex">
                <dt className="font-semibold w-32">Note :</dt>
                <dd className="text-gray-600">{product.rating.rate} / 5</dd>
              </div>
              <div className="flex">
                <dt className="font-semibold w-32">Avis :</dt>
                <dd className="text-gray-600">{product.rating.count} avis clients</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Bouton retour */}
      <div className="mt-12">
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          Retour aux produits
        </Link>
      </div>
    </div>
  );
}
