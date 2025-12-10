import { PrismaClient } from '@prisma/client';
const products = require('./seed-data/products_full.json');
const articles = require('./seed-data/articles_full.json');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const productData = products.map((product) => ({
    ...product,
    images: product.images || [],
    colors: product.colors || [],
    categories: product.categories || [],
  }));

  console.log('Creating products...');
  await prisma.product.createMany({
    data: productData,
    skipDuplicates: true,
  });
  console.log('Products created.');

  const articleData = articles.map((article) => ({
    title: article.title ?? 'No title',
    author: article.author ?? 'Unknown',
    images: article.images || [],
    date: article.date ?? '',
    text: (article.article_paragraphs || []).join('\n'),
  }));

  console.log('Creating articles...');
  await prisma.article.createMany({
    data: articleData,
    skipDuplicates: true,
  });
  console.log('Articles created.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
