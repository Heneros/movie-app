// app/movie/[id]/page.tsx
import { getMovie } from '@/lib/getMovie'
import type { Metadata } from 'next'

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await getMovie(params.id)
  return {
    title: movie.title,
    description: movie.overview
  }
}

export default async function MoviePage({ params }: Props) {
  const movie = await getMovie(params.id)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <p className="text-gray-300">{movie.overview}</p>
      <p className="mt-4">Rating: {movie.vote_average}</p>
    </div>
  )
}
