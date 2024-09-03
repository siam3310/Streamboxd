// app/api/movie/[tv_id]/route.ts

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function GET(request: NextRequest, { params }: { params: { tv_id: string } }) {
  const { tv_id } = params;
  const imdbApiUrl = `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${TMDB_API_KEY}`;

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
