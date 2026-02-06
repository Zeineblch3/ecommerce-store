import prisma from '@/app/lib/prisma.js';

export async function DELETE(req, context) {
  const { params } = context;
  const { id } = await params; // ← OBLIGATOIRE

  const orderId = Number(id);

  if (isNaN(orderId)) {
    return new Response('ID invalide', { status: 400 });
  }

  try {
    await prisma.order.delete({
      where: { id: orderId },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Erreur suppression commande :', err);
    return new Response('Erreur suppression commande', { status: 500 });
  }
}
