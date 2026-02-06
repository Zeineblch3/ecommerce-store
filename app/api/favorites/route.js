import prisma from '@/app/lib/prisma.js';
import { NextResponse } from "next/server";

/* GET : lister les favoris */
export async function GET() {
  const favorites = await prisma.favorite.findMany({
    include: { product: true }, // inclure les détails du produit
  });
  return NextResponse.json(favorites);
}

/* POST : ajouter un favori */
export async function POST(req) {
  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "productId manquant" }, { status: 400 });
  }

  try {
    const favorite = await prisma.favorite.create({
      data: { productId: Number(productId) },
    });
    return NextResponse.json(favorite);
  } catch (err) {
    console.error("Erreur ajout favori:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* DELETE : retirer un favori */
export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  try {
    await prisma.favorite.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Favori supprimé" });
  } catch (err) {
    console.error("Erreur suppression favori:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}