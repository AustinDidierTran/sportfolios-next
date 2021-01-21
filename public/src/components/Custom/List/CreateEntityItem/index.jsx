import React from 'react';
import CustomIcon from '../../Icon';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import styles from './CreateEntityItem.module.css';

export default function CreateEntityItem(props) {
  const { icon, title, description, onClick } = props;

  return (
    <ListItem button className={styles.main} onClick={onClick}>
      <ListItemIcon>
        <CustomIcon icon={icon} />
      </ListItemIcon>
      <ListItemText className={styles.text} primary={title} secondary={description} />
    </ListItem>
  );
}
