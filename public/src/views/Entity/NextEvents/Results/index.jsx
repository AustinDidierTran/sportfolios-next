import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Results.module.css';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

export default function Results() {
  const { t } = useTranslation();

  return (
    <Container className={styles.container}>
      <Button variant="contained" color="primary" className={styles.button}>
        {t('results')}
      </Button>
    </Container>
  );
}
