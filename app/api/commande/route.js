import prisma from '@/app/lib/prisma.js';

// Créer une commande
export async function POST(req) {
  const { items } = await req.json();

  if (!items || items.length === 0) return new Response('Panier vide', { status: 400 });

  try {
    const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        total,
        items: {
          create: items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price
          }))
        }
      },
      include: {
        items: { include: { product: true } }
      }
    });

    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Erreur création commande', { status: 500 });
  }
}


// Récupérer toutes les commandes
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = orders.map(order => ({
      id: order.id,
      createdAt: order.createdAt,
      items: order.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
        product: {
          id: i.product.id,
          title: i.product.title
        },
      })),
      total: order.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Erreur chargement commandes', { status: 500 });
  }
}



