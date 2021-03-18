import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '../../IconButton';

import styles from './MebershipInfoItem.module.css';

export default function MembershipDetailItem(props) {
  const { name, priceInfo, description, timeInfo, onClick, icon, tooltip } = props;

  return (
    <ListItem style={{ width: '100%' }} className={styles.main}>
      <ListItemText primary={`${name} ${priceInfo} ${timeInfo}`} secondary={description ? description : ''} />
      <ListItemSecondaryAction>
        <IconButton onClick={onClick} style={{ color: '#18B393' }} icon={icon} color="primary" tooltip={tooltip} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
