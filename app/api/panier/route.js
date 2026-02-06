// app/api/panier/route.js
import prisma from '@/app/lib/prisma.js';

export async function POST(req) {
  const { productId } = await req.json();

  if (!productId) return new Response('Produit manquant', { status: 400 });

  // Vérifie si l’item existe déjà pour incrémenter quantity
  const existing = await prisma.cartItem.findFirst({
    where: { productId: Number(productId) },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    });
  } else {
    await prisma.cartItem.create({
      data: { productId: Number(productId), quantity: 1 },
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
