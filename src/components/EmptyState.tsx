import { Alert } from "@mui/material"


interface EmptyStateProps { query: string; }

export default function EmptyState({query}: EmptyStateProps) {
    return(
        <Alert severity="info">Brak wyników dla "{query}". Spróbuj czegoś innego.</Alert>
    );
}