import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseTypography = {
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  h1: {
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    color: '#1B1B18',
    fontSize: '2.75rem', // 44px base
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
    fontSize: '1rem', // 16px
    lineHeight: 1.6,
    color: '#1B1B18',
  },
  body2: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.875rem', // 14px
    lineHeight: 1.5,
    color: '#6B6B63',
  },
  button: {
    fontFamily: '"Inter", sans-serif',
    textTransform: 'none',
    fontWeight: 500,
  },
};

const sharedPalette = {
  primary: { main: '#CC785C', contrastText: '#ffffff' },
  secondary: { main: '#6B6B63' },
  background: { default: '#F7F3EA', paper: '#EDE6D6' },
  text: { primary: '#1B1B18', secondary: '#6B6B63' },
  error: { main: '#E0574A' },
};

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 12, padding: '10px 24px', fontSize: '0.95rem', fontWeight: 500 },
      contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none', opacity: 0.95 } },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    },
  },
};

let learnerThemeBase = createTheme({
  palette: sharedPalette,
  typography: baseTypography,
  shape: { borderRadius: 12 },
  components: sharedComponents,
});

// Explicit overrides for the specific user requirements
learnerThemeBase.typography.h1 = {
  ...learnerThemeBase.typography.h1,
  fontSize: '1.875rem', // 30px mobile
  [learnerThemeBase.breakpoints.up('sm')]: { fontSize: '2.375rem' }, // 38px tablet
  [learnerThemeBase.breakpoints.up('md')]: { fontSize: '2.75rem' }, // 44px desktop
};

learnerThemeBase.typography.body1 = {
  ...learnerThemeBase.typography.body1,
  fontSize: '0.875rem', // 14px mobile
  [learnerThemeBase.breakpoints.up('sm')]: { fontSize: '0.9375rem' }, // 15px tablet
  [learnerThemeBase.breakpoints.up('md')]: { fontSize: '1rem' }, // 16px desktop
};

export const learnerTheme = responsiveFontSizes(learnerThemeBase);

let adminThemeBase = createTheme({
  palette: sharedPalette,
  typography: baseTypography,
  shape: { borderRadius: 12 },
  components: sharedComponents,
});

adminThemeBase.typography.h1 = learnerThemeBase.typography.h1;
adminThemeBase.typography.body1 = learnerThemeBase.typography.body1;

export const adminTheme = responsiveFontSizes(adminThemeBase);
export default learnerTheme;