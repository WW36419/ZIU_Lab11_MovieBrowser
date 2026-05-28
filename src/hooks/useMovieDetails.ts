import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '../api/tmdbClient';
import { QUERY_KEYS } from '../constants/queryKeys';


export interface Genre {
    id: number;
    name: string;
}

export interface MovieDetails {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    popularity: number;
    adult: boolean;
    genres: Genre[];
}


export function useMovieDetails(id: number | null) {
    return useQuery({
        queryKey: QUERY_KEYS.movies.detail(id ?? 0),
        queryFn: async () => {
            const { data } = await tmdbClient.get<MovieDetails>(`/movie/${id}`);
            return data;
        },
        enabled: id !== null, // pobiera TYLKO gdy modal otwarty
    });
}