import { PrismaClient } from '@prisma/client';
const products = require('./seed-data/products_full.json');
const articles = require('./seed-data/articles_full.json');
const users = require('./seed-data/dummy_users.json');

const sampleSentences = [
  'Ut maiores eos sit molestias ipsam. Hic maxime ea. Molestiae quas perspiciatis eaque iusto voluptatibus. Quas labore reiciendis voluptatum. Natus ipsa sequi quae aperiam beatae impedit perferendis. Tenetur nisi dignissimos nemo totam deleniti.\nExercitationem accusantium placeat enim nobis ut debitis quos rem. Aperiam aliquam iusto. Id veniam officia consectetur nam porro voluptates. Quibusdam eaque asperiores.\nMagni rem ab architecto corporis iste. Tempore esse perspiciatis deserunt distinctio incidunt recusandae. Odit facilis temporibus fugiat fugiat similique earum ratione. In aliquid possimus quaerat dignissimos. Laboriosam illo ipsam est.',
  'Dolorem perspiciatis nobis tempora impedit asperiores voluptate inventore quasi nostrum. Repellendus esse hic corrupti nemo quasi. Asperiores expedita quo quis unde reiciendis nulla vitae. Placeat ad rerum itaque voluptas beatae aliquam quis ipsam.',
  'Quia ipsa velit neque placeat dicta veritatis explicabo atque aut.\nNulla ea distinctio id accusantium.\nConsequuntur alias deserunt nemo voluptatem veritatis velit quidem.',
  'Molestiae quasi aspernatur atque. Quisquam eveniet magni. Quisquam cumque laboriosam. Quisquam dolores nostrum. Quisquam dicta beatae. Quisquam debitis itaque.',
  'Cupiditate exercitationem dolor exercitationem odio.\nMagnam dolorum repellendus fugit at.\nFugit veritatis natus.\nMaiores iste quam aspernatur.',
  'Minus consequatur exercitationem cum dolorum. Quo cupiditate voluptates modi porro vero. Neque nesciunt magnam.',
  'Et voluptatibus et non laborum numquam earum. Modi numquam commodi dolore beatae at. Deserunt ratione nemo totam dolor quae mollitia eveniet. Dignissimos adipisci harum veritatis modi dolores est ea rem perferendis.',
  'Laborum voluptas accusamus voluptates.',
  'Autem a saepe reprehenderit laudantium consequatur fugiat ipsam quam. Corporis vero veritatis facilis sunt aut quod asperiores. Atque sunt nesciunt eos itaque reprehenderit.\nUnde nam ex ullam. Iste in occaecati provident neque sint non amet eos ipsam. Explicabo quibusdam aut hic odio modi.\nEx impedit omnis veniam nemo. Pariatur repellendus iusto voluptates rerum. Dicta placeat totam. Ratione voluptatem numquam officiis sequi quidem laboriosam. Tenetur explicabo non reiciendis quidem facilis illo enim nobis. Minima veritatis voluptatem voluptate.',
  'Quo porro repudiandae ipsa voluptatem facilis cum fugit sit. Iure aut eveniet occaecati a fugiat. Optio nulla saepe aspernatur facere modi provident. Asperiores neque fuga accusamus id placeat eligendi vel qui. Quam quo ad ipsam labore similique voluptatum aspernatur hic earum.',
];

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  console.log('Creating users...');
  await prisma.user.createMany({ data: users, skipDuplicates: true });
  console.log('Users created.');

  const productCount = await prisma.product.count();
  if (productCount > 0) {
    console.log('Products already exist. Skipping product creation.');
  } else {
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
  }

  // fetch users and products to use their ids
  const dbUsers = await prisma.user.findMany({
    where: { email: { in: users.map((u) => u.email) } },
  });
  const dbProducts = await prisma.product.findMany({
    select: { id: true, title: true },
  });

  // If nothing to do, skip
  if (dbUsers.length > 0 && dbProducts.length > 0) {
    console.log('Preparing comments for products by test users...');

    const userIds = dbUsers.map((u) => u.id);
    const productIds = dbProducts.map((p) => p.id);

    // remove any existing comments from these users on these products to keep seeding idempotent
    await prisma.comment.deleteMany({
      where: { userId: { in: userIds }, productId: { in: productIds } },
    });

    const commentsData: any[] = [];
    dbProducts.forEach((product, pIdx) => {
      dbUsers.forEach((user, uIdx) => {
        // make rating between 1 and 5 randomly
        const rating = Math.floor(Math.random() * 5) + 1;
        const sentence =
          sampleSentences[(pIdx + uIdx) % sampleSentences.length];
        const content = `${sentence} (product: ${product.title})`;
        const addedAt = new Date(
          Date.now() - (pIdx * dbUsers.length + uIdx) * 1000,
        );

        commentsData.push({
          userId: user.id,
          productId: product.id,
          content,
          rating,
          addedAt,
        });
      });
    });

    console.log(`Creating ${commentsData.length} comments...`);
    // Insert in batches to avoid sending too large payloads
    const batchSize = 500;
    for (let i = 0; i < commentsData.length; i += batchSize) {
      const batch = commentsData.slice(i, i + batchSize);
      await prisma.comment.createMany({ data: batch });
    }

    console.log('Comments created.');

    // compute average rating per product from comments and update product.rate
    console.log('Computing product ratings from comments...');
    const ratingGroups = await prisma.comment.groupBy({
      by: ['productId'],
      _avg: { rating: true },
    });

    if (ratingGroups && ratingGroups.length > 0) {
      await Promise.all(
        ratingGroups.map((g) => {
          const avg = g._avg?.rating ?? null;
          if (avg === null) return Promise.resolve(null);
          const rounded = Math.round(avg);
          return prisma.product.update({
            where: { id: g.productId },
            data: { rate: rounded },
          });
        }),
      );
      console.log(`Updated ${ratingGroups.length} product rates.`);
    } else {
      console.log('No ratings found to update products.');
    }
  } else {
    console.log('No users or products found to create comments.');
  }

  const articleCount = await prisma.article.count();
  if (articleCount > 0) {
    console.log('Articles already exist. Skipping article creation.');
  } else {
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
  }

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
