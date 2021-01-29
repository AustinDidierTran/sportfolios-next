import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import { Skeleton } from '@material-ui/lab';
import { uniqueId } from 'lodash';
import React from 'react';

export default function AvatarAndTextSkeleton(props) {
  const { quantity } = props;
  const item = (
    <ListItem>
      <ListItemAvatar>
        <Skeleton variant="circular">
          <Avatar variant="circular" />
        </Skeleton>
      </ListItemAvatar>

      <ListItemText>
        <Skeleton variant="text"></Skeleton>
      </ListItemText>
    </ListItem>
  );
  let items = item;

  if (quantity) {
    items = new Array(quantity);
    for (let i = 0; i < quantity; i++) {
      items.push({ ...item, key: uniqueId('a&t_skeleton_') });
    }
  }
  return items;
}
