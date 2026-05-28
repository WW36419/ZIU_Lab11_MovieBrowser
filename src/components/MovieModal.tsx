import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RatingBox from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import { useMovieDetails } from '../hooks/useMovieDetails';

import { motion } from 'framer-motion';


// Definicja stylu (używamy Box i sx zamiast stałego obiektu style)
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
};

interface MovieModalProps { movieIdx: number; }

export default function MovieModal({ movieIdx }: MovieModalProps) {
    const { data: movieData, isLoading, isError } = useMovieDetails(movieIdx);

    // --- Obsługa stanów ładowania i błędów ---

    if (isLoading) {
        return (
            <Box sx={modalStyle}>
                <Typography variant="body1" color="text.secondary">
                    Ładowanie szczegółów filmu...
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={modalStyle}>
                <Typography variant="body1" color="error">
                    Błąd: Nie udało się załadować szczegółów filmu. Sprawdź dostępność ID.
                </Typography>
            </Box>
        );
    }

    // Jeśli nie ma danych (np. gdy useMovieDetails zwróci null/undefined)
    if (!movieData) {
         return (
            <Box sx={modalStyle}>
                <Typography variant="body1" color="text.secondary">
                    Nie znaleziono szczegółów dla tego filmu.
                </Typography>
            </Box>
        );
    }

    // --- Renderowanie danych, gdy są dostępne ---

    return (
            <Box sx={modalStyle}>
                {/* Sekcja Obrazu i Tytułu */}
                <Box>
                    {movieData.poster_path ? (
                        // Upewniamy się, że obraz ma odpowiednią szerokość w kontekście MUI
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} 
                            alt={movieData.title} 
                            style={{ width: '120px', marginRight: '20px', borderRadius: '4px' }}
                        />
                    ) : (
                        <Box sx={{ width: '120px', mr: 2, backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Brak plakatu
                        </Box>
                    )}
                    <div>
                        <Typography id="movie-title" variant="h5" component="h2">
                            {movieData.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            | {movieData.original_title || ''}
                        </Typography>
                    </div>
                </Box>

                {/* Sekcja Oceny i Metadanych */}
                <Box>
                    <RatingBox name="read-only" readOnly value={movieData.vote_average || 0} precision={0.5} max={10} />
                </Box>

                {/* Sekcja Gatunków (Genres) */}
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>Gatunki:</Typography>
                <Box>
                    {movieData.genres && movieData.genres.map((genre: any) => (
                        <Chip key={genre.id} label={genre.name} size="small" variant="outlined" />
                    ))}
                </Box>

                {/* Sekcja Informacji ogólnych */}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Szczegóły:</Typography>
                <Box>
                    <Typography variant="body2">
                        📅 Data premiery: {movieData.release_date || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                        ⭐ Popularność: {movieData.popularity?.toFixed(1)}
                    </Typography>
                    {/* Możesz dodać tu więcej informacji, np. gatunek (jeśli jest osobne pole) */}
                </Box>

                {/* Opis filmu (Overview) */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Opis:</Typography>
                <Typography variant="body2" color="text.secondary">
                    {movieData.overview || 'Brak opisu.'}
                </Typography>

            </Box>
    );
}
