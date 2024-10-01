import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },

    update: {},
    create: {
      email: 'sabin@adams.com',

      name: 'Sabin Adams',

      password: 'password-sabin',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'alex@ruheni.com' },

    update: {},

    create: {
      email: 'alex@ruheni.com',

      name: 'Alex Ruheni',

      password: 'password-alex',
    },
  });

  const movie1 = await prisma.movie.upsert({
    where: { title: 'Kill Bill' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Kill Bill',
      category: 'Action',
      rating: 5,
      preview: 'URL_to_preview_image_or_video',
      description: 'Good Movie',
      published: false,
      authorId: user1.id,
    },
  });

  const movie2 = await prisma.movie.upsert({
    where: { title: 'Anna ' },
    update: {
      authorId: user2.id,
    },
    create: {
      title: 'Anna',
      category: 'Action',
      rating: 5,
      preview: 'URL_to_preview_image_or_video',
      description: 'Wonderful movie',
      published: false,
      authorId: user2.id,
    },
  });

  const movie3 = await prisma.movie.upsert({
    where: { title: 'Back to the Future' },
    update: {},
    create: {
      title: 'Back to the Future',
      category: 'Science Fiction',
      rating: 7,
      preview: 'URL_to_preview_image_or_video',
      description:
        'In the 1980s, an experiment by a weird scientist turns out to be faulty. ',
      published: true,
    },
  });

  console.log({ movie1, movie2, movie3 });
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
