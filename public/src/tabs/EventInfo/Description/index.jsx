import React, { useMemo } from 'react';

import Paper from '../../../components/Custom/Paper';
import Typography from '@material-ui/core/Typography';
import styles from './Description.module.css';

export default function Description(props) {
  const { description } = props;

  const text = useMemo(() => (description ? decodeURIComponent(description) : ''), [description]);

  if (text && text != 'null') {
    return (
      <Paper className={styles.paper}>
        <Typography className={styles.textarea}>{text}</Typography>
      </Paper>
    );
  }

  return null;
}
