-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "preview" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "actorsList" TEXT[],
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "auId" INTEGER NOT NULL,
    "review" VARCHAR(2550) NOT NULL,
    "positive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actors" (
    "id" SERIAL NOT NULL,
    "preview" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ActorsOnMovies" (
    "actorId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "ActorsOnMovies_pkey" PRIMARY KEY ("actorId","movieId")
);

-- CreateTable
CREATE TABLE "VerifyResetToken" (
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserFavoriteMovies" (
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "UserFavoriteMovies_pkey" PRIMARY KEY ("userId","movieId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roles" TEXT[] DEFAULT ARRAY['User']::TEXT[],
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT[],
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_key" ON "Movie"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_id_key" ON "Reviews"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Actors_id_key" ON "Actors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Actors_name_key" ON "Actors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VerifyResetToken_userId_key" ON "VerifyResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerifyResetToken_token_key" ON "VerifyResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_movieId_key" ON "Rating"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_auId_fkey" FOREIGN KEY ("auId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorsOnMovies" ADD CONSTRAINT "ActorsOnMovies_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorsOnMovies" ADD CONSTRAINT "ActorsOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifyResetToken" ADD CONSTRAINT "VerifyResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteMovies" ADD CONSTRAINT "UserFavoriteMovies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteMovies" ADD CONSTRAINT "UserFavoriteMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
