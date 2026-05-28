import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainBrowser from './components/MainBrowser';
import HomePage from './components/HomePage';


function App() {
    return (
        <div className="app-container">
            <h1>🎬 TMDB Movie Search</h1>
            <BrowserRouter>
                <Routes>
                    <Route 
                        path='/' 
                        element={<HomePage />} 
                    />
                    <Route 
                        path='/search' 
                        element={<MainBrowser />} 
                    />
                </Routes>
            </BrowserRouter>
        </div>
        
    )
}

export default App;
