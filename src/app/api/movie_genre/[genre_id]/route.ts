

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function GET(request: NextRequest, { params }: { params: { genre_id: string } }) {
  const { genre_id } = params;
  const imdbApiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=1&language=en-US&sort_by=popularity.desc&with_genres=${genre_id}`;

  try {
    const response = await fetch(imdbApiUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
}
