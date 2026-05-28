import { useState, useCallback } from 'react';
import { useFavorites } from '../hooks/useFavourites';
import type { Movie } from '../hooks/useFetchMovies';
import "../styles/MovieCard.css"

import { motion, useReducedMotion } from 'framer-motion';


const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props { 
    movie: Movie; 
    openDetails(movieIdx: number|null): void;
}

export function MovieCard({ movie, openDetails }: Props) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);
    
    // Stan wyświetlany = optimistic (jeśli ustawiony) ?? rzeczywisty
    const displayedFav = optimisticFav ?? isFavorite(movie.id);
    const handleToggle = useCallback(async () => {
        // 1. Natychmiast zaktualizuj UI (optimistic)
        setOptimisticFav(!displayedFav);
        try {
            // 2. Wykonaj faktyczną operację
            await toggleFavorite(movie);
            // 3. Wyczyść stan optimistic — rzeczywisty stan zsynchronizowany
            setOptimisticFav(null);
        } catch {
            // 4. Rollback przy błędzie
            setOptimisticFav(null);
        }
    }, [displayedFav, toggleFavorite, movie]);

    const shouldReduce = useReducedMotion();
    const variants = {
        hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
        visible: { opacity: 1, y: 0 },
    };


    return (
        <motion.div 
            className='movie-card'
            variants={variants}
            initial='hidden'
            animate='visible'
        >
            <div onClick={() => openDetails(movie.id)}>
                <img
                    src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '/no-poster.png'}
                    alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.slice(0, 4)} • {movie.vote_average.toFixed(1)}</p>
            </div>
            <button
                onClick={handleToggle}
                aria-label={displayedFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                className={`fav-btn ${displayedFav ? 'active' : ''}`}
            >
                {displayedFav ? '❤️' : '🤍'} 
            </button>
        </motion.div>
    );
}
