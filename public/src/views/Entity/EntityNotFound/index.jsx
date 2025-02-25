import React from 'react';

import { ROUTES, goTo } from '../../../actions/goTo';

import { useTranslation } from 'react-i18next';

import styles from './EntityNotFound.module.css';

import IgContainer from '../../../components/Custom/IgContainer';
import Button from '../../../components/Custom/Button';
import Paper from '../../../components/Custom/Paper';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

export default function EntityNotFound() {
  const { t } = useTranslation();

  const handleClick = () => {
    goTo(ROUTES.home);
  };

  return (
    <div className={styles.main}>
      <IgContainer>
        <Paper className={styles.card}>
          <CardContent>
            <Typography variant="h1" component="h2">
              404
            </Typography>
            <Typography gutterBottom variant="h3" component="h2">
              {t('page_not_found')}
            </Typography>
          </CardContent>
          <CardActions className={styles.buttons}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              endIcon="Home"
              onClick={handleClick}
            >
              {t('return_home')}
            </Button>
          </CardActions>
        </Paper>
      </IgContainer>
    </div>
  );
}
