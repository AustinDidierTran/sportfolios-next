import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Register.module.css';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

export default function Register() {
  const { t } = useTranslation();

  return (
    <Container className={styles.container}>
      <Button
        variant="contained"
        // onClick={handleClick}
        className={styles.button}
        color="primary"
      >
        {t('registration')}
      </Button>
    </Container>
  );
}
