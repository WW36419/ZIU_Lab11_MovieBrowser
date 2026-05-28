import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainBrowser from './components/MainBrowser';
import HomePage from './components/HomePage';
 
const pageVariants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 16,  transition: { duration: 0.18, ease: 'easeIn' } },
};


function App() {
    return (
        <div className="app-container">
            <h1>🎬 TMDB Movie Search</h1>
            <AnimatePresence mode='wait'>
                <BrowserRouter>
                    <Routes>
                        <Route 
                            path='/' 
                            element={
                                <motion.div 
                                    variants={pageVariants}
                                    initial='initial' 
                                    animate='animate' 
                                    exit='exit'
                                >
                                    <HomePage />
                                </motion.div>
                            } 
                        />
                        <Route 
                            path='/search' 
                            element={
                                <motion.div 
                                    variants={pageVariants}
                                    initial='initial' 
                                    animate='animate' 
                                    exit='exit'
                                >
                                    <MainBrowser />
                                </motion.div>
                            } 
                        />
                    </Routes>
                </BrowserRouter>
            </AnimatePresence>
        </div>
        
    )
}

export default App;
