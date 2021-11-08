import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './RankingItem.module.css';
import Divider from '@material-ui/core/Divider';
import { COLORS } from '../../../../../utils/colors';

export default function RankingItem(props) {
  const { index, name, positionName } = props;

  if (index % 2 === 0) {
    return (
      <>
        <ListItem
          style={{
            width: '100%',
            backGroundColor: COLORS.grey,
          }}
        >
          <div className={styles.main} style={{ width: '100%' }}>
            <ListItemText className={styles.position} secondary={index + 1} />
            <ListItemText className={styles.name} primary={positionName} secondary={name} />
          </div>
        </ListItem>
        <Divider />
      </>
    );
  }
  return (
    <>
      <ListItem
        style={{
          width: '100%',
          backGroundColor: 'primary',
        }}
      >
        <div className={styles.main} style={{ width: '100%' }}>
          <ListItemText className={styles.position} secondary={index + 1} />
          <ListItemText className={styles.name} primary={positionName} secondary={name} />
        </div>
      </ListItem>
      <Divider />
    </>
  );
}
