import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './PrerankingItem.module.css';
import Divider from '@material-ui/core/Divider';

export default function PrerankingItem(props) {
  const { index, name, positionName, position } = props;

  return (
    <>
      <ListItem
        style={{
          width: '100%',
          backGroundColor: index % 2 === 0 ? 'rgb(240, 240, 240)' : 'primary',
        }}
      >
        <div className={styles.main} style={{ width: '100%' }}>
          <ListItemText className={styles.position} secondary={position} />
          <ListItemText className={styles.name} primary={positionName} secondary={name} />
        </div>
      </ListItem>
      <Divider />
    </>
  );
}
