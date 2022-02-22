import { COLORS } from './src/utils/colors';

import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
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
      main: COLORS.turquoise,
      veryLight: COLORS.veryLightTurquoise,
      dark: COLORS.darkTurquoise,
      light: COLORS.lightTurquoise,
      constrastText: COLORS.white,
    },
    secondary: {
      light: COLORS.lightRed,
      main: COLORS.red,
      dark: COLORS.darkRed,
      contrastText: COLORS.white,
    },
    shadesOfGrey: {
      white: COLORS.white,
      veryLight: COLORS.veryLightGrey,
      light: COLORS.mediumLightGrey,
      black: COLORS.black,
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
