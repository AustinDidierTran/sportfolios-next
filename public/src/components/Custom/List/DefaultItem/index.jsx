import React from 'react';

import { ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import CustomIcon from '../../Icon';

export default function DefaultItem(props) {
  const { onClick, selected, iconComponent, icon, value, secondaryAction, description } = props;

  return (
    <ListItem button={Boolean(onClick)} onClick={onClick} selected={selected} style={{ width: '100%' }}>
      {iconComponent ? (
        <ListItemIcon>{iconComponent}</ListItemIcon>
      ) : (
        <ListItemIcon>
          <CustomIcon icon={icon}></CustomIcon>
        </ListItemIcon>
      )}
      <ListItemText primary={value} secondary={description}></ListItemText>
      <ListItemSecondaryAction>
        <>{secondaryAction}</>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
