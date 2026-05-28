import { Alert } from "@mui/material"

export default function ErrorBanner() {
    return(
        <Alert severity="error">Wystąpił błąd podczas pobierania danych.</Alert>
    );
}