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
      // movies: movie1.id,
      name: 'Admin',
      roles: ['Admin', 'Editor', 'User'],
      password: passwordAdmin,
      isEmailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@email.com' },

    update: {
      password: passwordUser,
    },
    create: {
      email: 'user@email.com',
      name: 'Default User',
      roles: ['User'],
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
      actorsList: [],
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

  const review1 = await prisma.reviews.upsert({
    where: { id: 1 },
    update: {},
    create: {
      auId: user1.id,
      movieId: movie1.id,
      positive: false,
      review: 'test test',
    },
  });

  const movie3 = await prisma.movie.upsert({
    where: { title: 'Back to the Future', authorId: user1.id },
    update: {
      authorId: user1.id,
      reviews: {
        connect: { id: review1.id },
      },
    },
    create: {
      reviews: {
        connect: { id: review1.id },
      },

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
  console.log({ movie3, review1 });
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
