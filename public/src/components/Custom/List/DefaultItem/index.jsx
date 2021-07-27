import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '../../Icon';

export default function DefaultItem(props) {
  const { onClick, selected, iconComponent, icon, value, secondaryAction, description } = props;

  return (
    <ListItem button={Boolean(onClick)} onClick={onClick} selected={selected} style={{ width: '100%' }}>
      {iconComponent ? (
        <ListItemIcon>{iconComponent}</ListItemIcon>
      ) : (
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
      )}
      <ListItemText primary={value} secondary={description} />
      <ListItemSecondaryAction>
        <>{secondaryAction}</>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
