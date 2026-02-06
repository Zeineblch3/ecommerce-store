import { prisma } from './app/lib/prisma.js';

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Categories:', categories);

  const products = await prisma.product.findMany();
  console.log('Products:', products);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
