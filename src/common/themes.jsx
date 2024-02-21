import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import { Typography } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#673AB7', // DeepPurple
        },
        secondary: {
            main: '#FFC107', // amber 
        },
    },
    background: {
        default: '#F5F5F5', // custom Beige 
    },
});

export const HighlightedText = styled(Typography)({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
});
