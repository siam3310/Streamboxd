// app/api/movie/[movie_id]/route.ts

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function GET(request: NextRequest, { params }: { params: { type_of_content: string } }) {
  const { type_of_content } = params;

  // Construct the appropriate URL based on `type_of_content`
  let apiUrl: string;

  if (type_of_content === 'movie') {
    apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`;
  } else if (type_of_content === 'tv') {
    apiUrl = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}&page=1`;
  } else {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const response = await fetch(apiUrl);
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
