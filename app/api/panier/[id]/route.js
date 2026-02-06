// app/api/panier/[id]/route.js
import prisma from '@/app/lib/prisma.js';

export async function DELETE(req, context) {
  // context.params est maintenant une Promise
  const params = await context.params;
  const { id } = params;

  if (!id) return new Response('ID manquant', { status: 400 });

  try {
    const deletedItem = await prisma.cartItem.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify({ success: true, deletedItem }), {
      status: 200,
    });
  } catch (err) {
    console.error('Erreur suppression cartItem:', err);
    return new Response('Erreur suppression', { status: 500 });
  }
}
