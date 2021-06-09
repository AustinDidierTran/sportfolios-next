import React, { useMemo } from 'react';

import Paper from '../../../components/Custom/Paper';
import Typography from '@material-ui/core/Typography';
import styles from './Description.module.css';

interface IProps {
  description?: string;
}

const Description: React.FunctionComponent<IProps> = (props) => {
  const { description } = props;

  const text: string = useMemo(() => (description ? decodeURIComponent(description) : ''), [description]);

  if (text && text != 'null') {
    return (
      <Paper className={styles.paper}>
        <Typography className={styles.textarea}>{text}</Typography>
      </Paper>
    );
  }

  return <></>;
};
export default Description;
