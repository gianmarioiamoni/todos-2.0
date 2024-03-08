import { Grid, Typography, Button } from "@mui/material"
import { Google, Apple, LinkedIn } from '@mui/icons-material';

export default function SocialsRegistrationBox({ onClickGoogle }) {
    return (
        <Grid container direction="column" spacing={1} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
            <Grid item>
                <Typography variant="body1">Or register with:</Typography>
            </Grid>
            <Grid item style={{ width: '80%' }}>
                <Button
                    variant="contained"
                    style={{ width: '100%', backgroundColor: '#FF0000', color: '#fff' }}
                    startIcon={<Google />}
                    onClick={ () => onClickGoogle() }
                >
                    Google
                </Button>
            </Grid>
            <Grid item style={{ width: '80%' }}>
                <Button
                    variant="contained"
                    style={{ width: '100%', backgroundColor: '#000', color: '#fff' }}
                    startIcon={<Apple />}
                    onClick={() => {
                        // Aggiungi qui la logica per la registrazione con Apple
                    }}
                >
                    Apple
                </Button>
            </Grid>
            <Grid item style={{ width: '80%' }}>
                <Button
                    variant="contained"
                    style={{ width: '100%', backgroundColor: '#0077B5', color: '#fff' }}
                    startIcon={<LinkedIn />}
                    onClick={() => {
                        // Aggiungi qui la logica per la registrazione con LinkedIn
                    }}
                >
                    LinkedIn
                </Button>
            </Grid>
        </Grid>
    )
    
}