import { MovieCard } from './MovieCard';
import MovieModal from './MovieModal';
import { useFetchMovies } from '../hooks/useFetchMovies';
import type { Movie } from '../hooks/useFetchMovies';
import React, { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Modal } from '@mui/material';
import { SkeletonCard } from './SkeletonCard';
import ErrorBanner from './ErrorBanner';
import EmptyState from './EmptyState';
import { useFavorites } from '../hooks/useFavourites';
import { Divider } from '@mui/material';

import { motion, Reorder } from 'framer-motion';



export default function MainBrowser() {
    // 1. Stan zarządzający kwerendą wyszukiwania (query)
    const [searchQuery, setSearchQuery] = useState('');
    // 2. Stan zarządzający numerem strony (page)
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMovieIdx, setModalMovieIdx] = useState(-1);

    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };
    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };


    const openModal = (movieIdx: number|null) => {
        setIsModalOpen(true);
        if (movieIdx !== null)
            setModalMovieIdx(movieIdx);
    } 

    const closeModal = () => {
        setIsModalOpen(false)
        setModalMovieIdx(-1);
    }


    // Wywołanie hooka do pobierania filmów
    // Przekazujemy aktualną kwerendę i stronę jako argumenty
    const { data: moviesData, isLoading, isError } = useFetchMovies(currentPage, useDebounce(searchQuery, 300));
    const favData = useFavorites();

    // Obliczenie listy filmów do wyświetlenia (puste tablice na początek)
    const movies: Movie[] = moviesData?.results || [];
    const favMovies: Movie[] = favData.favorites;

    const setFavourites = favData.toggleFavorite;
    
    // Obsługa wyszukiwania (wywoływana po zmianie kwerendy)
    const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim().length < 2) {
            alert('Proszę wprowadzić co najmniej 2 znaki.');
            return;
        }
        // Resetowanie do pierwszej strony przy nowym wyszukiwaniu
        setCurrentPage(1);
    }, [searchQuery]);

    // Obsługa nawigacji na następną stronę
    const handleNextPage = () => {
        // Zakładamy, że dane zawierają total_pages (zdefiniowane w useFetchMovies)
        if (moviesData && moviesData.total_pages > currentPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // Obsługa nawigacji na poprzednią stronę
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };


    return (
        <>
            {/* Formularz wyszukiwania */}
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Szukaj filmów..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Movie search query"
                />
                <button type="submit">Szukaj</button>
            </form>

            


            {/* Obsługa stanów ładowania i błędów */}
            {/* <div className="loading-state">Ładowanie filmów...</div> */}
            {isLoading && (
                <div className="movie-list">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            )}

            {/* <div className="error-state">Wystąpił błąd podczas pobierania danych.</div> */}
            {isError && (
                <ErrorBanner />
            )}

            {/* <div className="no-results">Brak wyników dla "{searchQuery}". Spróbuj czegoś innego.</div> */}
            {!isLoading && movies.length === 0 && searchQuery.trim().length > 0 && !isError && (
                <EmptyState query={searchQuery} />
            )}


            {/* Wyświetlanie kart ulubionych filmów*/}
            {(favMovies.length > 0 || searchQuery.trim().length === 0) && !isLoading && (
                <div>
                    <h2>Ulubione filmy ({favMovies.length})</h2>
                    <Divider />
                    <Reorder.Group 
                        className='movie-list'
                        axis='y' 
                        values={favMovies} 
                        onReorder={setFavourites}
                    >
                        {favMovies.map(movie => (
                            <Reorder.Item key={movie.id} value={movie}>
                                <MovieCard movie={movie} openDetails={openModal} />
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>
            )}


            {/* Wyświetlanie kart popularnych filmów*/}
            {(movies.length > 0 || searchQuery.trim().length === 0) && !isLoading && (
                <div>
                    <h2>Popuarne filmy</h2>
                    <Divider />
                    <motion.ul 
                        className='movie-list'
                        variants={container} 
                        initial='hidden' 
                        animate='visible'
                    >
                        {movies.map((movie: Movie) => (
                            <motion.li key={movie.id} variants={item}>
                                <MovieCard movie={movie} openDetails={openModal} />
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            )}

            {/* Kontrolki Paginacji */}
            {moviesData && !isLoading && searchQuery.trim().length > 0 && (
                <div className="pagination-controls">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                    >
                        &larr; Poprzednia Strona
                    </button>
                    <span>Strona {currentPage} / {moviesData.total_pages}</span>
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage >= moviesData.total_pages}
                    >
                        Następna Strona &rarr;
                    </button>
                </div>
            )}

            {/* Modal szczegółów filmu */}
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="movie-modal"
            >
                <MovieModal movieIdx={modalMovieIdx} />
            </Modal>
        </>
    );
}
