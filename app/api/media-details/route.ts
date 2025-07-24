// app/api/media-details/route.ts
// This is a Next.js API route, which runs on the server.

import { getMediaDetails } from '@/lib/server/tmdb-api'; // Import server-side API functions
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('mediaType');
  const id = searchParams.get('id');

  if (!mediaType || !id) {
    return NextResponse.json({ error: 'mediaType and id parameters are required.' }, { status: 400 });
  }

  // Ensure mediaType is valid
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return NextResponse.json({ error: 'Invalid mediaType. Must be "movie" or "tv".' }, { status: 400 });
  }

  try {
    // Fetch data using the server-side TMDB API utility
    const data = await getMediaDetails(mediaType, id);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`API Route Error fetching media details for ${mediaType} ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch media details.' }, { status: 500 });
  }
}