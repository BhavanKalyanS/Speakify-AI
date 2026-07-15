import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#CC785C', // Clay warm
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6B6B63', // Mist text
    },
    background: {
      default: '#F7F3EA', 
      paper: 'rgba(255, 255, 255, 0.65)', // Glassmorphic paper
    },
    text: {
      primary: '#1B1B18', 
      secondary: '#6B6B63', 
    },
    error: {
      main: '#E0574A', 
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
    borderRadius: 16,
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
          boxShadow: '0 4px 14px 0 rgba(204,120,92,0.39)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(204,120,92,0.5)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px rgba(27, 27, 24, 0.04)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(247, 243, 234, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(27,27,24,0.06)',
          boxShadow: 'none',
        }
      }
    }
  },
});

export const learnerTheme = responsiveFontSizes(baseTheme);
export const adminTheme = responsiveFontSizes(baseTheme);

export default learnerTheme;