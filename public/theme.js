import { createMuiTheme } from '@material-ui/core/styles';
import { COLORS } from './src/utils/colors';

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    // primary: teal,
    primary: {
      main: '#18B393',
      veryLight: '#1acba8',
      dark: '#008a6c',
      light: '#19bf9d',
      constrastText: COLORS.white,
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: COLORS.white,
    },
    shadesOfGrey: {
      white: COLORS.white,
      veryLight: '#f9f9f9',
      light: '#f1f1f1',
      black: '000000',
    },
  },
});

theme.typography.h2 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1.8rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.8rem',
  },
};

theme.typography.h3 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1.4rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.8rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

theme.typography.h4 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1.2rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.6rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.1rem',
  },
};

theme.typography.h5 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.4rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.8rem',
  },
};

theme.typography.h6 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.4rem',
  },
};

export default theme;
