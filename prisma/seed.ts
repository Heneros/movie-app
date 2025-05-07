import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const roundsOfHashing = 10;


async function main() {
 await prisma.directorsOnMovie.deleteMany();
await prisma.actorsOnMovies.deleteMany();
await prisma.userFavoriteMovies.deleteMany();
await prisma.reviews.deleteMany();
await prisma.rating.deleteMany();
await prisma.movie.deleteMany();
await prisma.director.deleteMany();
await prisma.actors.deleteMany();
await prisma.actorsOnMovies.deleteMany();


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

    const director1 = await prisma.director.upsert({
    where: { name: 'Quentin Tarantino' },
    update: {},
    create: {
      name: 'Quentin Tarantino'
    }
  });

  const director2 = await prisma.director.upsert({
    where: { name: 'Luc Besson' },
    update: {},
    create: {
      name: 'Luc Besson'
    }
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
      year: 2003,
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
          year: 2019,
      description: 'Wonderful movie',
      published: false,
      authorId: user1.id,
    },
  });



  await prisma.directorsOnMovie.createMany({
  data: [
    {
      movieId: movie1.id,
      directorId: director1.id,
    },
    {
      movieId: movie2.id,
      directorId: director2.id,
    },
  ],
  skipDuplicates: true,
});
  
  const director = await prisma.director.upsert({
    where: {id: movie1.id},
    update:{},
    create:{
      name: 'Tarantino'
    }
  })

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
 
year: 1985,
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
  const actor1 = await prisma.actors.upsert({
    where: { name: 'Johnny Depp' },
    update: {},
    create: {
      name: 'Johnny Depp',
    //   previewId: newAvatar.id,
      age: '12-03-1996',
    },
  });



 const newAvatar = await prisma.avatar.upsert({
    where:{
            publicId: "avatar_123"
    },
    update:{},
    create:{
    url: "https://example.com/avatar.jpg",
    publicId: "avatar_123",
    actorsId: actor1.id,
    userId: user1.id,
 
    }
})

  const userFav = await prisma.userFavoriteMovies.createMany({
    data: {
      userId: user1.id,
      movieId: movie1.id,
    },
    skipDuplicates: true
  });

  const actors = await prisma.directorsOnMovie.createMany({
  data: [
    { movieId: movie1.id, directorId: director1.id },
    { movieId: movie2.id, directorId: director2.id },
  ],
  skipDuplicates: true,
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
