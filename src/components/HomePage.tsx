import { useState } from "react";
import { Button, ButtonGroup } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from './ToastContainer';

const toastData = [
    {id: 1, message: "Test toast 1"}
]


export default function HomePage() {

    const [isToastOpen, setToastOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <ButtonGroup 
                variant="contained" 
                aria-label="Basic button group"
            >
               <Button onClick={() => navigate('/search')}>
                    Otwórz wyszukiwarkę
                </Button>
                <Button onClick={() => setToastOpen(!isToastOpen)}>
                    {isToastOpen ? "Zamknij toast" : "Otwórz toast"}
                </Button> 
            </ButtonGroup>
            

            {/* Obsługa ToastContainer */}
            {isToastOpen && (
                <ToastContainer toasts={toastData} />
            )}
        </>
    )
}