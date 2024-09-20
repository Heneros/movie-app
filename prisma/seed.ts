import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const movie1 = await prisma.movie.upsert({
    where: { title: 'Kill Bill' },
    update: {},
    create: {
      title: 'Kill Bill',
      category: 'Action',
      rating: 5,
      preview: 'URL_to_preview_image_or_video',
      description: 'Good Movie',
      published: false,
    },
  });

  const movie2 = await prisma.movie.upsert({
    where: { title: 'Anna ' },
    update: {},
    create: {
      title: 'Anna',
      category: 'Action',
      rating: 5,
      preview: 'URL_to_preview_image_or_video',
      description: 'Wonderful movie',
      published: false,
    },
  });

  console.log({ movie1, movie2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
