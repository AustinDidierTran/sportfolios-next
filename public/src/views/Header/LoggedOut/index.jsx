import React from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';

import styles from './LoggedOut.module.css';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { goTo, ROUTES } from '../../../actions/goTo';
import Button from '../../../components/Custom/Button';
import { useTranslation } from 'react-i18next';

export default function LoggedOut(props) {
  const { t } = useTranslation();
  const router = useRouter();

  const { isNotLogin } = props;

  return (
    <div>
      <AppBar position="static" style={{ position: 'fixed', top: 0 }}>
        <Toolbar>
          <Typography className={styles.title} style={{ fontSize: '1.5rem', color: 'white' }} noWrap>
            <Link href={ROUTES.home} className={styles.link}>
              Sportfolios
            </Link>
          </Typography>
          {isNotLogin && (
            <div className={styles.login}>
              <Button
                className={styles.button}
                disableElevation
                onClick={() => {
                  const redirectUrl = encodeURIComponent(router.asPath);
                  goTo(ROUTES.login, null, { redirectUrl });
                }}
              >
                {t('connection')}
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
