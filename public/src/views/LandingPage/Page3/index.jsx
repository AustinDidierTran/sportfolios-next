import React from 'react';

import styles from '../LandingPage.module.css';
import MobileContainer from '../../../components/Custom/MobileContainer';
import Button from '../../../components/Custom/Button';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { ROUTES, goTo } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { AddGaEvent } from '../../../components/Custom/Analytics';

export default function Page3() {
  const { t } = useTranslation();

  return (
    <div className={styles.greenContainer}>
      <MobileContainer>
        <div className={styles.block}>
          <div>
            <Typography className={styles.text} variant="h2">
              {t('landingPage.explanation.1')}
            </Typography>
            <Typography className={styles.text} variant="h2">
              {t('landingPage.explanation.2')}
            </Typography>
          </div>
          <div>
            <Typography className={styles.text} variant="h5">
              {t('landingPage.explanation.3')}

              <strong>{t('landingPage.explanation.4')}</strong>
              {t('landingPage.explanation.5')}

              <strong>{t('landingPage.explanation.6')}</strong>
              {t('landingPage.explanation.7')}
            </Typography>
          </div>
          <div className={styles.checkboxContainer}>
            <ListItem>
              <CheckBoxIcon className={styles.checkBox} />
              <ListItemText
                primary={t('landingPage.explanation.8')}
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              />
            </ListItem>
            <ListItem>
              <CheckBoxIcon className={styles.checkBox} />
              <ListItemText
                primary={t('landingPage.explanation.9')}
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              />
            </ListItem>
            <ListItem>
              <CheckBoxIcon className={styles.checkBox} />
              <ListItemText
                primary={t('landingPage.explanation.10')}
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              />
            </ListItem>
            <ListItem>
              <CheckBoxIcon className={styles.checkBox} />
              <ListItemText
                primary={t('landingPage.explanation.11')}
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              />
            </ListItem>
            <ListItem>
              <CheckBoxIcon className={styles.checkBox} />
              <ListItemText
                primary={t('landingPage.explanation.12')}
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              />
            </ListItem>
          </div>
          <div>
            <Typography style={{ margin: '8px' }} className={styles.text} variant="h5">
              {t('landingPage.explanation.13')}
            </Typography>
          </div>
          <Button
            onClick={() => {
              AddGaEvent({
                category: 'Landing page',
                action: 'User clicked to be redirected to login',
                label: 'landing_page_login',
              });
              goTo(ROUTES.login);
            }}
            className={styles.button}
          >
            {t('landingPage.explanation.14')}
          </Button>
        </div>
      </MobileContainer>
    </div>
  );
}
