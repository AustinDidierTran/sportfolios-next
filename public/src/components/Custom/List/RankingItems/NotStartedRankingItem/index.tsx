import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './NotStartedRankingItem.module.css';
import Divider from '@material-ui/core/Divider';
import { IPhaseRanking } from '../../../../../../../typescript/event';

interface IProps {
  index: number;
  ranking: IPhaseRanking;
}

const NotStartedRankingItem: React.FunctionComponent<IProps> = (props) => {
  const { index, ranking } = props;

  return (
    <>
      <ListItem
        style={{
          width: '100%',
          backgroundColor: index % 2 === 0 ? 'rgb(240, 240, 240)' : 'primary',
        }}
      >
        <div className={styles.main} style={{ width: '100%' }}>
          <ListItemText className={styles.position} secondary={ranking.initialPosition} />
          <ListItemText className={styles.name} primary={ranking.team?.name} />
        </div>
      </ListItem>
      <Divider />
    </>
  );
};

export default NotStartedRankingItem;
