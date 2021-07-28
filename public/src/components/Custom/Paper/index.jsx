import React from 'react';
import Paper from '@material-ui/core/Paper';

import styles from './Paper.module.css';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function CustomPaper(props) {
  const { title, children, childrenProps, titleStyle, ...paperProps } = props;
  const [width] = useWindowSize();

  const [elevation, setElevation] = React.useState(0);

  React.useEffect(() => {
    if (width < MOBILE_WIDTH) {
      setElevation(0);
    } else {
      setElevation(2);
    }
  }, [width]);

  return (
    <Paper elevation={elevation} {...paperProps}>
      {title ? (
        <div className={titleStyle ? titleStyle: styles.title}>
          <span>{title}</span>
        </div>
      ) : null}
      <div {...childrenProps}>{children}</div>
    </Paper>
  );
}
