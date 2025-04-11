import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const roundsOfHashing = 10;


async function main() {
  const passwordAdmin = await bcrypt.hash('password-admin', roundsOfHashing);
  const passwordUser = await bcrypt.hash('password-user', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: {
      email: 'admin@email.com',
    },
    update: {
      password: passwordAdmin,
    },
    create: {
      email: 'admin@email.com',
      name: 'Admin',
      roles: ['Admin', 'Editor', 'User'],
      password: passwordAdmin,
      isEmailVerified: true,
    // avatarId: 2
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
            isEmailVerified: true,
    //   avatarId: 1
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
      // rating: 5,
    //   previewId: 2,
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
      // authorId: user1.id,
      // reviews: {
      //   connect: { id: review1.id },
      // },
    },
    create: {
      reviews: {
        connect: { id: review1.id },
      },

      title: 'Back to the Future',
      category: 'Science Fiction',
      // rating: 7,
    //   previewId: 1,
      description:
        'In the 1980s, an experiment by a weird scientist turns out to be faulty. ',
      published: true,
      authorId: user1.id,
    },
  });

const newAvatar = await prisma.avatar.create({
    data:{
            url: "https://example.com/avatar.jpg",
    publicId: "avatar_123"
    }
})

  const actor1 = await prisma.actors.upsert({
    where: { name: 'Johnny Depp' },
    update: {},
    create: {
      name: 'Johnny Depp',
      previewId: newAvatar.id,
      
      age: '12-03-1996',
    },
  });

  const userFav = await prisma.userFavoriteMovies.create({
    data: {
      userId: user1.id,
      movieId: movie1.id,
    },
  });

  const actors = await prisma.actorsOnMovies.create({
    data: {
      actorId: actor1.id,
      movieId: movie1.id,
    },
  });

  console.log({ userFav, actors });
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
