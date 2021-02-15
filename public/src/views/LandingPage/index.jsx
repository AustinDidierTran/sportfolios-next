import React from 'react';

import styles from './LandingPage.module.css';
import { LOGO_ENUM } from '../../../common/enums';
import Divider from '@material-ui/core/Divider';
import MobileContainer from '../../components/Custom/MobileContainer';
import Button from '../../components/Custom/Button';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { ROUTES, goTo } from '../../actions/goTo';

export default function LandingPage() {
  return (
    <>
      <div className={styles.whiteContainer}>
        <MobileContainer>
          <div className={styles.block}>
            <div className={styles.logo}>
              <img src={LOGO_ENUM.LOGO_1024X1024} height="200px" width="200px" />
            </div>
            <Divider variant="middle" className={styles.dividerRoot} />
            <div>
              <Typography className={styles.text} variant="h4">
                Modernisez votre gestion.
              </Typography>
              <Typography className={styles.text} variant="h4">
                Augmentez votre efficacité.
              </Typography>
              <Typography className={styles.text} variant="h4">
                Gagnez du temps.
              </Typography>
            </div>
            <Divider variant="middle" className={styles.dividerRoot} />
            <div>
              <Typography className={styles.text} variant="h4">
                Avec nous :
              </Typography>
              <Typography className={styles.text} variant="h4">
                Les athlètes jouent;
              </Typography>
              <Typography className={styles.text} variant="h4">
                Les entraineurs entrainent;
              </Typography>
              <Typography className={styles.text} variant="h4">
                Les organisateurs organisent;
              </Typography>
              <Typography className={styles.text} variant="h4">
                C'est tout.
              </Typography>
            </div>
            <Button
              onClick={() => {
                goTo(ROUTES.login);
              }}
              className={styles.button}
            >
              Accéder à la plateforme
            </Button>
          </div>
        </MobileContainer>
      </div>
      <div className={styles.greenContainer}>
        <MobileContainer>
          <div className={styles.block}>
            <div>
              <Typography className={styles.text} variant="h2">
                C'est quoi,
              </Typography>
              <Typography className={styles.text} variant="h2">
                Sportfolios?
              </Typography>
            </div>
            <div>
              <Typography className={styles.text} variant="h5">
                Une plateforme
                <strong> simple </strong>
                et
                <strong> intuitive </strong>
                qui regroupe toutes les étapes nécessaires à votre planification sportive.
              </Typography>
            </div>
            <div className={styles.checkboxContainer}>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Gestion des horaires"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Gestion des inscriptions"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Paiements sécurisés"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Entrée de résultats"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
              <ListItem>
                <CheckBoxIcon className={styles.checkBox} />
                <ListItemText
                  primary="Messagerie interne &
                système de notifications aux
                membres"
                  primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                />
              </ListItem>
            </div>
            <div>
              <Typography style={{ margin: '8px' }} className={styles.text} variant="h5">
                Utilisez votre temps pour ce qui compte réellement. On s'occupe du reste.
              </Typography>
            </div>
            <Button
              onClick={() => {
                goTo(ROUTES.login);
              }}
              className={styles.button}
            >
              Commencer gratuitement
            </Button>
          </div>
        </MobileContainer>
      </div>
    </>
  );
}
