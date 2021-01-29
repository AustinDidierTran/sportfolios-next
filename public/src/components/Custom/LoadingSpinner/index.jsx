import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './LoadingSpinner.module.css';
import CustomPaper from '../Paper';

export default function LoadingSpinner(props) {
  const { isComponent } = props;

  if (isComponent) {
    return (
      <div>
        <CircularProgress className={styles.component} />
      </div>
    );
  }

  return (
    <CustomPaper>
      <CircularProgress className={styles.page} />
    </CustomPaper>
  );
}
