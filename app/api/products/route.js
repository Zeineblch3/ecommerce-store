import prisma from '../../lib/prisma.js';
import { NextResponse } from 'next/server';

/* CREATE */
export async function POST(req) {
  const data = await req.json();

  const product = await prisma.product.create({
    data
  });

  return NextResponse.json(product);
}

/* READ */
export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  return NextResponse.json(products);
}

/* UPDATE */
export async function PUT(req) {
  const { id, ...data } = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data
  });

  return NextResponse.json(product);
}

/* DELETE */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) throw new Error("ID manquant");

    await prisma.product.delete({
      where: { id: Number(id) }, // <-- conversion en Int
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Erreur DELETE produit:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

