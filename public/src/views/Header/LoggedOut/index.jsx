import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import  styles from './LoggedOut.module.css';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { goTo, ROUTES } from '../../../actions/goTo';
import Button from '../../../components/Custom/Button';


export default function LoggedOut(props) {
  const { t } = useTranslation();
  const {isLogin} = props;

  return (
    <div>
      <AppBar position="static" style={{ position: 'fixed', top: 0 }}>
        <Toolbar>
          <Typography className={styles.title} style={{ fontSize: '1.5rem', color: 'white'}} noWrap>
            <Link href={ROUTES.home} className={styles.link}>Sportfolios</Link>
          </Typography>
            {isLogin ? 
              (
                <></>
              ) : 
              (
                <div className={styles.login}>
                  <Button className={styles.button} disableElevation onClick={() => {
                    goTo(ROUTES.login);
                  }}>
                    {t('connection')}
                  </Button> 
                </div>
              )    
            }
        </Toolbar>
      </AppBar>
    </div>
  );
}
