import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '16px',
  },
  firstCardContent: {
    padding: '8px !important',
    backgroundColor: theme.palette.primary.main,
  },
  secondCardContent: {
    padding: '8px !important',
    backgroundColor: 'black',
  },
  role: {
    color: 'white',
    fontWeight: 250,
  },
  image: {
    height: '200px',
  },
}));

export default function OurTeamMember(props) {
  const { name, role, src } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={5}>
      <CardMedia className={classes.image} component="img" src={src} />
      <CardContent className={classes.firstCardContent}>
        <Typography style={{ whiteSpace: 'pre-line' }} variant="h5">
          {name}
        </Typography>
      </CardContent>
      <CardContent className={classes.secondCardContent}>
        <Typography style={{ whiteSpace: 'pre-line' }} variant="body1" className={classes.role}>
          {role}
        </Typography>
      </CardContent>
    </Card>
  );
}
