import React from 'react';
import { Card, CardActionArea, ListItemText } from '@material-ui/core';

export default function Report(props) {
  const { title, description, onClick } = props;
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <ListItemText primary={title} secondary={description} />
      </CardActionArea>
    </Card>
  );
}
