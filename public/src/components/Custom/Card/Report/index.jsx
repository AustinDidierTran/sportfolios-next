import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import ListItemText from '@material-ui/core/ListItemText';

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
