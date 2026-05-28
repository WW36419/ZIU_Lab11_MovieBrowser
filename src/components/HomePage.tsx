import { Button } from "@mui/material"
import { useNavigate } from 'react-router-dom'


export default function HomePage() {

    const navigate = useNavigate();

    return (
        <>
            <Button variant="contained" onClick={() => navigate('/search')}>
                Otwórz wyszukiwarkę
            </Button>
        </>
    )
}