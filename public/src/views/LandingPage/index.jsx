import React from 'react';

import styles from './LandingPage.module.css';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LOGO_ENUM } from '../../../common/enums';
import Divider from '@material-ui/core/Divider';
import MobileContainer from '../../components/Custom/MobileContainer';
import Button from '../../components/Custom/Button';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { ROUTES, goTo } from '../../actions/goTo';

const useStyles = makeStyles((theme) =>
  createStyles({
    dividerRoot: {
      backgroundColor: theme.palette.primary.main,
      width: '30vw',
      margin: 'auto',
      padding: '1px',
      borderRadius: '4px',
      marginTop: '16px !important',
      marginBottom: '16px !important',
    },
    typo: {
      color: theme.palette.primary.main,
      margin: '4px !important',
      fontWeight: 250,
    },
    whiteTypo: {
      color: theme.palette.primary.light,
      fontWeight: 150,
    },
    button: {
      width: '40vw',
      margin: 'auto',
      marginTop: '36px',
      marginBottom: '16px',
    },
    whiteButton: {
      width: '40vw',
      margin: 'auto',
      marginTop: '24px',
      marginBottom: '64px',
      backgroundColor: 'white',
      color: `${theme.palette.primary.main} !important`,
    },
    checkBox: {
      color: 'white !important',
      fontSize: 32,
      marginRight: '8px',
      marginLeft: '32px',
    },
    container: {
      backgroundColor: theme.palette.primary.main,
    },
  })
);

export default function LandingPage() {
  const classes = useStyles();
  return (
    <>
      <MobileContainer>
        <div className={styles.logo}>
          <img src={LOGO_ENUM.LOGO_1024X1024} height="200px" width="200px" />
        </div>
        <Divider variant="middle" className={classes.dividerRoot} />
        <Typography className={classes.typo} variant="h5">
          Modernisez votre gestion.
        </Typography>
        <Typography className={classes.typo} variant="h5">
          Augmentez votre efficacité.
        </Typography>
        <Typography className={classes.typo} variant="h5">
          Gagnez du temps.
        </Typography>
        <Divider variant="middle" className={classes.dividerRoot} />
        <Typography className={classes.typo} variant="h5">
          Avec nous :
        </Typography>
        <Typography className={classes.typo} variant="h5">
          Les athlètes jouent;
        </Typography>
        <Typography className={classes.typo} variant="h5">
          Les entraineurs entrainent;
        </Typography>
        <Typography className={classes.typo} variant="h5">
          Les organisateurs organisent;
        </Typography>
        <Typography className={classes.typo} variant="h5">
          C'est tout.
        </Typography>
        <Button
          onClick={() => {
            goTo(ROUTES.login);
          }}
          className={classes.button}
        >
          Accéder à la plateforme
        </Button>
      </MobileContainer>
      <div className={classes.container}>
        <MobileContainer>
          <Typography style={{ marginTop: '16px' }} className={classes.whiteTypo} variant="h2">
            C'est quoi,
          </Typography>
          <Typography style={{ margin: '8px' }} className={classes.whiteTypo} variant="h2">
            Sportfolios?
          </Typography>
          <Typography style={{ margin: '16px' }} className={classes.whiteTypo} variant="h5">
            Une plateforme
            <strong> simple </strong>
            et
            <strong> intuitive </strong>
            qui regroupe toutes les étapes nécessaires à votre planification sportive.
          </Typography>
          <div style={{ margin: '8px' }} />
          <ListItem>
            <CheckBoxIcon className={classes.checkBox} />
            <ListItemText
              primary="Gestion des horaires"
              primaryTypographyProps={{ variant: 'h5', className: classes.whiteTypo }}
            />
          </ListItem>
          <ListItem>
            <CheckBoxIcon className={classes.checkBox} />
            <ListItemText
              primary="Gestion des inscriptions"
              primaryTypographyProps={{ variant: 'h5', className: classes.whiteTypo }}
            />
          </ListItem>
          <ListItem>
            <CheckBoxIcon className={classes.checkBox} />
            <ListItemText
              primary="Paiements sécurisés"
              primaryTypographyProps={{ variant: 'h5', className: classes.whiteTypo }}
            />
          </ListItem>
          <ListItem>
            <CheckBoxIcon className={classes.checkBox} />
            <ListItemText
              primary="Entrée de résultats"
              primaryTypographyProps={{ variant: 'h5', className: classes.whiteTypo }}
            />
          </ListItem>
          <ListItem>
            <CheckBoxIcon className={classes.checkBox} />
            <ListItemText
              primary="Messagerie interne &
              système de notifications aux
              membres"
              primaryTypographyProps={{ variant: 'h5', className: classes.whiteTypo }}
            />
          </ListItem>
          <div style={{ margin: '8px' }}></div>
          <Typography style={{ margin: '8px' }} className={classes.whiteTypo} variant="h5">
            Utilisez votre temps pour ce qui compte réellement. On s'occupe du reste.
          </Typography>
          <Button
            onClick={() => {
              goTo(ROUTES.login);
            }}
            className={classes.whiteButton}
          >
            Commencer gratuitement
          </Button>
        </MobileContainer>
      </div>
    </>
  );
}
