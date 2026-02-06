import prisma from "@/app/lib/prisma";

export async function DELETE(req, context) {
  try {
    const { params } = context;
    // params est une Promise, donc il faut l'attendre
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    await prisma.category.delete({ where: { id } });
    
return new Response(JSON.stringify({ message: "Supprimé" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Erreur", { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    const body = await req.json();
    const updated = await prisma.category.update({
      where: { id },
      data: body,
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Erreur", { status: 500 });
  }
}