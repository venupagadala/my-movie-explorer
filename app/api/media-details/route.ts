// app/api/media-details/route.ts
// This is a Next.js API route, which runs on the server.

import { getMediaDetails, getMediaVideos } from '@/lib/server/tmdb-api'; // Import getMediaVideos
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('mediaType');
  const id = searchParams.get('id');
  const fetchVideos = searchParams.get('videos') === 'true'; // Check for 'videos=true' parameter

  if (!mediaType || !id) {
    return NextResponse.json({ error: 'mediaType and id parameters are required.' }, { status: 400 });
  }

  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return NextResponse.json({ error: 'Invalid mediaType. Must be "movie" or "tv".' }, { status: 400 });
  }

  try {
    if (fetchVideos) {
      // If 'videos=true' is present, fetch videos
      const videosData = await getMediaVideos(mediaType, id);
      return NextResponse.json(videosData);
    } else {
      // Otherwise, fetch media details (default behavior)
      const data = await getMediaDetails(mediaType, id);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`API Route Error fetching media details/videos for ${mediaType} ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch media details or videos.' }, { status: 500 });
  }
}