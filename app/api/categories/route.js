import prisma from '../../lib/prisma';

// 3 niveaux vers lib

import { NextResponse } from 'next/server';

// Lire toutes les catégories
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.error();
  }
}

// Ajouter une catégorie
export async function POST(req) {
  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: { name: body.name },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("Erreur POST catégorie:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


