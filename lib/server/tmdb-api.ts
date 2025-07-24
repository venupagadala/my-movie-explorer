// lib/server/tmdb-api.ts
// This file contains server-side API fetching logic and MUST NOT be imported by client components.
import 'server-only';

// Base URL for TMDB API
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Ensure API key is available from environment variables
// This check only runs on the server side where this file is imported.
if (!process.env.TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables. Please check your .env.local file.");
}

const API_KEY = process.env.TMDB_API_KEY;

/**
 * Generic function to fetch data from TMDB API.
 * Handles API key injection and basic error handling.
 * @param endpoint The TMDB API endpoint (e.g., "/trending/movie/week", "/movie/popular")
 * @param params Optional query parameters
 * @returns Parsed JSON response from the API
 */
async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY); // Add API key to every request

  // Add any additional parameters
  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }

  try {
    const response = await fetch(url.toString(), {
      // Next.js's fetch automatically handles caching for Server Components.
      // For dynamic data that changes frequently, 'no-store' or 'no-cache' might be considered.
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ status_message: "Unknown error from TMDB" }));
      console.error(`TMDB API Error (${response.status} ${response.statusText}):`, errorData);
      throw new Error(`Failed to fetch data from TMDB: ${errorData.status_message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    throw error;
  }
}

/**
 * Fetches trending movies for the week.
 * @returns An array of TmdbMediaItem (movies)
 */
export async function getTrendingMovies(): Promise<TmdbMediaItem[]> {
  const data = await fetchFromTmdb("/trending/movie/week");
  return data.results;
}

/**
 * Fetches trending TV shows for the week.
 * @returns An array of TmdbMediaItem (TV shows)
 */
export async function getTrendingTvShows(): Promise<TmdbMediaItem[]> {
  const data = await fetchFromTmdb("/trending/tv/week");
  return data.results;
}

/**
 * Fetches movies based on a search query.
 * @param query The search term
 * @returns An array of TmdbMediaItem (movies)
 */
export async function searchMovies(query: string): Promise<TmdbMediaItem[]> {
  if (!query) return [];
  const data = await fetchFromTmdb("/search/movie", { query });
  return data.results;
}

/**
 * Fetches TV shows based on a search query.
 * @param query The search term
 * @returns An array of TmdbMediaItem (TV shows)
 */
export async function searchTvShows(query: string): Promise<TmdbMediaItem[]> {
  if (!query) return [];
  const data = await fetchFromTmdb("/search/tv", { query });
  return data.results;
}

/**
 * Fetches details for a specific movie or TV show.
 * @param mediaType "movie" or "tv"
 * @param id The ID of the movie/TV show
 * @returns TmdbMovieDetails or TmdbTvShowDetails
 */
export async function getMediaDetails(mediaType: "movie" | "tv", id: string): Promise<TmdbMovieDetails | TmdbTvShowDetails> {
  if (!mediaType || !id) throw new Error("mediaType and id are required to get media details.");
  const data = await fetchFromTmdb(`/${mediaType}/${id}`);
  return data;
}

/**
 * Fetches movies that are currently playing in theaters.
 * @returns An array of TmdbMediaItem (movies)
 */
export async function getNowPlayingMovies(): Promise<TmdbMediaItem[]> {
  const data = await fetchFromTmdb("/movie/now_playing");
  return data.results;
}

// NOTE: Types are intentionally NOT exported from here.
// They will be exported from lib/types/tmdb.ts
import { TmdbMediaItem, TmdbMovieDetails, TmdbTvShowDetails } from '../types/tmdb'; // Import types for internal use