import { createTheme } from '@mui/material/styles';

export const learnerTheme = createTheme({
  palette: {
    primary: {
      main: '#CC785C', // Clay warm
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6B6B63', // Mist text
    },
    background: {
      default: '#F7F3EA', // Parchment
      paper: '#EDE6D6', // Sand card
    },
    text: {
      primary: '#1B1B18', // Ink text
      secondary: '#6B6B63', // Mist text
    },
    error: {
      main: '#E0574A', // Alert coral
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      color: '#1B1B18',
    },
    h2: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      color: '#1B1B18',
    },
    h3: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    h4: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    h5: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    h6: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#1B1B18',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#6B6B63',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            opacity: 0.95,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#CC785C', // Clay warm
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6B6B63', // Mist text
    },
    background: {
      default: '#F7F3EA', // Parchment
      paper: '#EDE6D6', // Sand card
    },
    text: {
      primary: '#1B1B18', // Ink text
      secondary: '#6B6B63', // Mist text
    },
    error: {
      main: '#E0574A', // Alert coral
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      color: '#1B1B18',
    },
    h2: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      color: '#1B1B18',
    },
    h3: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    h4: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    h5: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    h6: {
      fontFamily: 'Georgia, serif',
      fontWeight: 600,
      color: '#1B1B18',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#1B1B18',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#6B6B63',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            opacity: 0.95,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default learnerTheme;