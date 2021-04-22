import React from 'react';
import Paper from '@material-ui/core/Paper';
import { SCREENSIZE_ENUM } from '../../../Store';

import styles from './Paper.module.css';
import { useWindowSize } from '../../../hooks/window';

export default function CustomPaper(props) {
  const { title, children, childrenProps, ...paperProps } = props;
  const [width] = useWindowSize();

  const [elevation, setElevation] = React.useState(0);

  React.useEffect(() => {
    if (width === SCREENSIZE_ENUM.xs) {
      setElevation(0);
    } else {
      setElevation(2);
    }
  }, [width]);

  return (
    <Paper elevation={elevation} {...paperProps}>
      {title ? (
        <div className={styles.title}>
          <span>{title}</span>
        </div>
      ) : null}
      <div {...childrenProps}>{children}</div>
    </Paper>
  );
}
