import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
  const passwordAdmin = await bcrypt.hash('password-admin', roundsOfHashing);
  const passwordUser = await bcrypt.hash('password-user', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@email.com' },

    update: {
      password: passwordAdmin,
    },
    create: {
      email: 'admin@email.com',

      name: 'Admin',

      roles: ['Admin', 'Editor', 'User'],

      password: passwordAdmin,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user@email.com' },

    update: {
      password: passwordUser,
    },
    create: {
      email: 'user@email.com',
      name: 'Default User',
      password: passwordUser,
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
    where: { title: 'Anna' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Anna',
      category: 'Action',
      rating: 5,
      preview: 'URL_to_preview_image_or_video',
      description: 'Wonderful movie',
      published: false,
      authorId: user1.id,
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
      authorId: user1.id,
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
