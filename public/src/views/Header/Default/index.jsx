import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import styles from './Default.module.css';
import LoggedIn from '../LoggedIn';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function DefaultHeader(props) {
  const [width] = useWindowSize();
  //what is this
  const { Item1 = () => <></>, Item2 = () => <></>, Item3 = () => <></>, Item4 = () => <></>, showBar = true } = props;

  const It1 = () => {
    return (
      <div className={styles.item1}>
        <Item1 />
      </div>
    );
  };

  const It2 = () => {
    return (
      <div className={styles.item2}>
        <div className={styles.center}>
          <Item2 />
        </div>
      </div>
    );
  };

  const It3 = () => {
    return (
      <div className={styles.item3}>
        <Item3 />
      </div>
    );
  };

  const It4 = () => {
    return (
      <div className={styles.item4}>
        <Item4 />
      </div>
    );
  };

  if (width > MOBILE_WIDTH) {
    return <LoggedIn showBar={showBar} />;
  }
  return (
    // mobile here
    <div className={styles.barHeight}>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar>
          <div className={styles.container}>
            <It1 />
            <It2 />
            <It3 />
            <It4 />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
