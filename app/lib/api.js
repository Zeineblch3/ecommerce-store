const API_URL = 'https://fakestoreapi.com';

/**
 * Fetch tous les produits
 * @returns {Promise<Array>} Liste des produits
 */
export async function getAllProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: {
        revalidate: 3600 // ISR : 1 heure
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const products = await res.json();
    return products;
  } catch (error) {
    console.error('Erreur fetch products:', error);
    throw new Error('Impossible de recuperer les produits');
  }
}

/**
 * Fetch un produit par ID
 * @param {number} id-ID du produit
 * @returns {Promise<Object>} Produit
 */
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: {
        revalidate: 60 // ISR : 1 minute
      }
    });

    if (!res.ok) {
      throw new Error(`Produit ${id} non trouve`);
    }

    const product = await res.json();
    return product;
  } catch (error) {
    console.error(`Erreur fetch product ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch toutes les categories
 * @returns {Promise<Array<string>>} Categories
 */
export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/products/categories`, {
      next: {
        revalidate: 86400 // ISR : 24 heures (rarement change)
      }
    });

    if (!res.ok) {
      throw new Error('Erreur categories');
    }

    return res.json();
  } catch (error) {
    console.error('Erreur fetch categories:', error);
    return []; 
  }
}

/**
 * Fetch produits par categorie
 * @param {string} category-Nom de la categorie
 * @returns {Promise<Array>} Produits de la categorie
 */
export async function getProductsByCategory(category) {
  try {
    const res = await fetch(`${API_URL}/products/category/${category}`, {
      next: {
        revalidate: 3600 // ISR : 1 heure
      }
    });
    if (!res.ok) {
    throw new Error(`Categorie ${category} non trouvee`);
    }

    return res.json();
    } catch (error) {
    console.error(`Erreur fetch category ${category}:`, error);
    throw error;
    }
}