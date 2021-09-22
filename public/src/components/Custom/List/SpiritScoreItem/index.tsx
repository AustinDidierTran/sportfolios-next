import React from 'react';

import { ISpiritRanking } from '../../../../../../typescript/entity';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './SpiritScoreItem.module.css';

interface IProps {
  spirit: ISpiritRanking;
  index: number;
}

const SpiritScoreItem: React.FunctionComponent<IProps> = (props) => {
  const { spirit, index } = props;
  return (
    <ListItem>
      <div className={styles.main}>
        <ListItemText className={styles.position} secondary={index} />
        <ListItemText className={styles.name} primary={spirit.name} />
        <ListItemText className={styles.spirit} primary={spirit.spirit} />
      </div>
    </ListItem>
  );
};

export default SpiritScoreItem;
